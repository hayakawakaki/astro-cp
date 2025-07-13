import yaml from "js-yaml";
import luaparse from "luaparse";

import type { ItemDatabase, ItemDatabaseFormat, ItemInfoInput, ItemInfoLUA, ItemTrade, ItemYAMLReturn } from "@/types";

import { createLuaLoader, createYmlLoader } from "@/lib/rathena-db/db-loader";
import config from "@root/app-config";

const _itemDB: ItemDatabase = new Map();
const _loadYamlDB = createYmlLoader("ItemDatabaseYML", "item");
const _loadItemInfo = createLuaLoader("ItemDatabaseLUA", "item");

// Create Database
async function _createItemDatabase(): Promise<ItemDatabase> {
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
  itemDB.map(item => _itemDB.set(item.Id, item));

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

// Helper Functions
async function getItemDatabase(): Promise<ItemDatabase> {
  if (_itemDB.size > 0) {
    return _itemDB;
  }
  return _createItemDatabase();
}

// Get item data
async function getItemInfo(id: number): Promise<ItemDatabaseFormat | null> {
  // Should be cached already at this point.
  const itemDB = await getItemDatabase();
  return itemDB.get(id) || null;
}

function getTradeRestrictions(trade: ItemTrade | undefined): string[] {
  if (!trade)
    return ["No Restriction"];

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

export { getItemDatabase, getItemInfo, getTradeRestrictions };
