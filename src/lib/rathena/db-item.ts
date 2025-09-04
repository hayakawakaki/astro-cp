import yaml from "js-yaml";
import luaparse from "luaparse";

import type {
  DropDatabase,
  ItemDatabase,
  ItemDatabaseFormat,
  ItemInfoInput,
  ItemInfoLUA,
  ItemTrade,
  ItemType,
  ItemYAMLReturn,
} from "@/rathena";

import config from "~/app-config";

import { _loadItemDB, _loadItemInfo } from "./db-loader";

const _itemDB: ItemDatabase = new Map(); // Item Id lookup
const _itemNameDB: ItemDatabase = new Map(); // Item name lookup
const _dropDatabase: DropDatabase = new Map(); // For reverse lookup

// Create Database
export async function _createItemDatabase(): Promise<ItemDatabase> {
  if (_itemDB.size > 0) {
    return _itemDB;
  }

  if (!config.ItemDatabaseYML.length) {
    throw new Error("There is no added item database yaml in the app configuration.");
  }

  const [yamlDB, itemInfo] = await Promise.all([_loadItemDB(), _loadItemInfo()]);

  if (!yamlDB.length) {
    throw new Error("There is no item db yml loaded, make sure the yml file is in the correct folder.");
  }

  const itemInfoMap: ItemInfoLUA = new Map();

  // Parse iteminfo
  itemInfo.forEach((item) => {
    const ast = luaparse.parse(item);
    _parseIteminfo(ast, itemInfoMap);
  });

  const itemDB: ItemDatabaseFormat[] = [];

  yamlDB.forEach((item) => {
    const result = yaml.load(item) as ItemYAMLReturn;

    result.Body.forEach((value) => {
      const index = itemDB.findIndex(item => item.Id === value.Id);

      if (index >= 0) {
        const data = { ...itemDB[index], ..._setItemDefaults(value) };

        // Lua value won't change, no need to fetch it again
        itemDB[index] = data as ItemDatabaseFormat;
      }
      else {
        const itemId = _setItemDefaults(value);
        const clientInfo = itemInfoMap.get(itemId.Id);

        // Add default values and description/image from iteminfo
        if (clientInfo) {
          itemId.Description = _processDescription(clientInfo.identifiedDescriptionName);
          itemId.Image = clientInfo.identifiedResourceName.toLowerCase();
          itemId.ClientName = clientInfo.identifiedDisplayName;
        }
        else {
          itemId.Description = ["No description."];
          itemId.Image = "unknown";
          itemId.ClientName = itemId.Name;
        }

        itemDB.push(itemId);
      }
    });
  });

  // Need sort here for multiple yaml support and pagination
  itemDB.sort((a, b) => a.Id - b.Id);

  // Insert into a map for caching
  itemDB.forEach((item) => {
    _itemDB.set(item.Id, item);
    _itemNameDB.set(item.AegisName, item);
    _dropDatabase.set(item.Id, new Set());
  });

  return _itemDB;
}

// Helper for default values since defaults are handled in the rathena src
function _setItemDefaults(item: ItemDatabaseFormat): ItemDatabaseFormat {
  const data = {
    ...item,
    Buy: item.Buy ?? 0,
    Sell: item.Sell || (item.Buy && Math.floor(item.Buy / 2)) || 0,
    Weight: item.Weight || 0,
    Trade: item.Trade,
  };
  switch (item.Type) {
    case "Weapon":
      return { ...data, Type: "Weapon", SubType: item.SubType };
    case "Ammo":
      return { ...data, Type: "Ammo", SubType: item.SubType };
    case "Card":
      return { ...data, Type: "Card", SubType: item.SubType };
    default:
      return { ...data, Type: item.Type, SubType: "None" };
  }
}

// https://github.com/fstirlitz/luaparse
function _parseIteminfo(ast: luaparse.Chunk, targetMap: ItemInfoLUA) {
  const assignment = ast.body[0] as luaparse.AssignmentStatement;
  if (!assignment)
    return; // return on empty data
  const table = assignment.init[0] as luaparse.TableConstructorExpression;

  table.fields.forEach((field) => {
    if (field.type === "TableKey") {
      const itemId = (field.key as luaparse.NumericLiteral).value;

      // should return existing Id
      if (targetMap.get(itemId))
        return;

      const itemData: Partial<ItemInfoInput> = {};

      (field.value as luaparse.TableConstructorExpression).fields.forEach((prop) => {
        if (prop.type === "TableKeyString") {
          const propName = (prop.key as luaparse.Identifier).name;

          // don't need other data aside from these two
          if (propName === "identifiedResourceName" || propName === "identifiedDescriptionName" || propName === "identifiedDisplayName") {
            const propValue = prop.value;

            switch (propValue.type) {
              case "StringLiteral": // Every other data
              case "NumericLiteral": // Slot/Classnum
              case "BooleanLiteral": // costume
                // Slice to remove the double quotes
                (itemData as any)[propName] = (propValue.raw.slice(1, -1));
                break;

              case "TableConstructorExpression": // description
                (itemData as any)[propName] = propValue.fields.map((line) => {
                  let value;
                  switch (line.type) {
                    case "TableValue":
                      value = (line as luaparse.TableValue).value;
                      break;
                    case "TableKeyString":
                      value = (line as luaparse.TableKeyString).value;
                      break;
                    case "TableKey":
                      value = (line as luaparse.TableKey).value;
                      break;
                  }
                  return (itemData as any)[propName] = (value as luaparse.StringLiteral).raw.slice(1, -1); ;
                });
            }
          }
        }
      });
      targetMap.set(itemId, itemData as ItemInfoInput);
    }
  });
}

function _processDescription(set: string[]) {
  const patterns = [
    { pattern: /\^([0-9A-F]{6})(.*?)\^000000/gi, replacement: "<span style='color: #$1'>$2</span>" }, // Add client's color styling
    { pattern: /<TIPBOX>(.*?)<INFO>(.*?)<\/INFO><\/TIPBOX>/g, replacement: "<span class='text-blue-400'>$1</span>" }, // Remove tipbox
    { // Replace <navi> to be a copyable text when clicked
      pattern: /<NAVI>(.*?)<INFO>([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^<]*)<\/INFO><\/NAVI>/g,
      replacement:
        "<span class='text-nowrap cursor-pointer underline underline-offset-2 text-blue-400'"
        + "x-data @click=\"$store.util.copyText('/navi $2 $3/$4')\">"
        + "</svg>"
        + "$1"
        + "</span>",
    },
  ];

  const coloredDescription = set.map((item) => {
    let processed = item;
    patterns.forEach((match) => {
      const matches = processed.match(match.pattern);
      if (matches) {
        processed = processed.replace(match.pattern, match.replacement);
      }
    });
    return processed;
  });
  return coloredDescription;
};

export async function _addDrop(item: number | string, mobId: number, dropRate: number) {
  if (!_itemDB.size) {
    await _createItemDatabase();
  }

  let itemId;

  if ((typeof item) === "string") {
    itemId = _itemNameDB.get(item)?.Id || null;
  }
  else {
    itemId = _itemDB.get(item)?.Id || null;
  }

  if (!itemId || !_itemDB.has(itemId))
    return;

  _dropDatabase.get(itemId)?.add({ mobId, dropRate });
}

// Just pass the value and check if it's string or number to know which cache to get data from
export async function _getItemDatabase(value?: number | string): Promise<ItemDatabase> {
  if (!_itemDB.size) {
    await _createItemDatabase();
  }
  if (!value || (typeof value) === "number") {
    return _itemDB;
  }
  else {
    return _itemNameDB;
  }
}

export async function _getDropDatabase(): Promise<DropDatabase> {
  if (!_dropDatabase.size) {
    await _createItemDatabase();
  }
  return _dropDatabase;
}

export const _tradeDisplay: Record<keyof Omit<ItemTrade, "Override">, string> = {
  NoDrop: "No Drop",
  NoTrade: "No Trade",
  TradePartner: "Trade Partner",
  NoSell: "No Sell",
  NoCart: "No Cart",
  NoStorage: "No Storage",
  NoGuildStorage: "No Guild Storage",
  NoMail: "No Mail",
  NoAuction: "No Auction",
};

export const _typeDisplay: Record<ItemType, string> = {
  Healing: "Potion/Food",
  Usable: "Usable",
  Etc: "Etc",
  Weapon: "Weapon",
  Armor: "Armor",
  Card: "Card",
  PetEgg: "Pet Egg",
  PetArmor: "Pet Equipment",
  Ammo: "Arrow/Ammunition",
  DelayConsume: "Buff/Box/Action",
  ShadowGear: "Shadow Equipment",
  Cash: "Cash Usable",
};
