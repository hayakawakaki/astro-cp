import yaml from "js-yaml";
import luaparse from "luaparse";

import type {
  DropDatabase,
  ItemDatabase,
  ItemDatabaseFormat,
  ItemInfoInput,
  ItemInfoLUA,
  ItemTrade,
  ItemYAMLReturn,
  WhoDropFormat,
} from "@/types";

import config from "~/app-config";

import { createLuaLoader, createYmlLoader } from "./db-loader";

const _itemDB: ItemDatabase = new Map(); // Item Id lookup
const _itemNameDB: ItemDatabase = new Map(); // Item name lookup
const _dropDatabase: DropDatabase = new Map(); // For reverse lookup
const _loadYamlDB = createYmlLoader("ItemDatabaseYML", "item");
const _loadItemInfo = createLuaLoader("ItemDatabaseLUA", "item");

// Create Database
async function createItemDatabase(): Promise<ItemDatabase> {
  if (_itemDB.size > 0) {
    return _itemDB;
  }

  if (!config.ItemDatabaseYML.length) {
    throw new Error("There is no added item database yaml in the app configuration.");
  }

  const [yamlDB, itemInfo] = await Promise.all([_loadYamlDB(), _loadItemInfo()]);

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
    // Add default values and description/image from iteminfo
    const processed = result.Body.map((value) => {
      const itemId = _setItemDefaults(value);
      const clientInfo = itemInfoMap.get(itemId.Id);

      if (clientInfo) {
        itemId.Description = _processDescription(clientInfo.identifiedDescriptionName) || ["No description added."];
        itemId.Image = clientInfo.identifiedResourceName.toLowerCase() || "NoImage";
      }

      return itemId;
    });
    return itemDB.push(...processed);
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

// = Helper for default values since defaults are handled in the rathena src
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
      const itemData: Partial<ItemInfoInput> = {};

      (field.value as luaparse.TableConstructorExpression).fields.forEach((prop) => {
        if (prop.type === "TableKeyString") {
          const propName = (prop.key as luaparse.Identifier).name;

          // don't need other data aside from these two
          if (propName === "identifiedResourceName" || propName === "identifiedDescriptionName") {
            const propValue = prop.value;

            switch (propValue.type) {
              case "StringLiteral": // Every other data
              case "NumericLiteral": // Slot/Classnum
              case "BooleanLiteral": // costume
                // Slice to remove the double quotes
                (itemData as any)[propName] = (propValue.raw.slice(1, -1));
                break;

              case "TableConstructorExpression": // description
                (itemData as any)[propName] = propValue.fields.map((f) => {
                  let value;
                  switch (f.type) {
                    case "TableValue":
                      value = (f as luaparse.TableValue).value;
                      break;
                    case "TableKeyString":
                      value = (f as luaparse.TableKeyString).value;
                      break;
                    case "TableKey":
                      value = (f as luaparse.TableKey).value;
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
    { pattern: /\^([0-9A-F]{6})(.*?)\^000000/gi, replacement: "<span style='color: #$1'>$2</span>" },
    { pattern: /\^000000/g, replacement: "" },
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

async function addDrop(item: number | string, mobId: number, dropRate: number) {
  if (!_itemDB.size) {
    await createItemDatabase();
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

async function whoDrops(itemId: number): Promise<Set<WhoDropFormat>> {
  // Shouldn't happen but just in case
  if (!_dropDatabase.size) {
    return new Set();
  }
  return _dropDatabase.get(itemId) || new Set();
}

// Helper Functions
async function getItemDatabase(): Promise<ItemDatabase> {
  if (_itemDB.size > 0) {
    return _itemDB;
  }
  return await createItemDatabase();
}

// Get item data
async function getItemInfo(id: number): Promise<ItemDatabaseFormat | null> {
  // Should be cached already at this point.
  const itemDB = await getItemDatabase();
  return itemDB.get(id) || null;
}

async function getItemName(value: string | number): Promise<string | null> {
  if (!_itemDB.size) {
    await createItemDatabase();
  }

  if ((typeof value) === "string") {
    return _itemNameDB.get(value)?.Name || null;
  }
  else {
    return _itemDB.get(value)?.Name || null;
  }
}

function getTradeRestrictions(trade: ItemTrade | undefined): string[] {
  if (!trade)
    return [];

  const restrictions = [];
  if (trade.NoDrop)
    restrictions.push("No Drop");
  if (trade.NoTrade)
    restrictions.push("No Trade");
  if (trade.NoSell)
    restrictions.push("No Sell");
  if (trade.NoMail)
    restrictions.push("No Mail");
  if (trade.NoCart)
    restrictions.push("No Cart");
  if (trade.NoStorage)
    restrictions.push("No Storage");
  if (trade.NoGuildStorage)
    restrictions.push("No Guild Storage");
  if (trade.NoAuction)
    restrictions.push("No Auction");

  return restrictions;
}

export { addDrop, createItemDatabase, getItemDatabase, getItemInfo, getItemName, getTradeRestrictions, whoDrops };
