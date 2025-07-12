import yaml from "js-yaml";
import luaparse from "luaparse";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

import type { ItemDatabase, ItemDatabaseFormat, ItemInfoInput, ItemInfoLUA, ItemTrade, ItemYAMLReturn } from "@/types";

import { appConfig } from "@root/app-config";

const _itemDB: ItemDatabase = new Map();

export async function getItemDatabase(): Promise<ItemDatabase> {
  if (_itemDB.size > 0) {
    return _itemDB;
  }
  return _createItemDatabase();
}

// Create Database
async function _createItemDatabase(): Promise<ItemDatabase> {
  if (_itemDB.size > 0) {
    return _itemDB;
  }

  if (!appConfig.ItemDatabaseYML.length) {
    throw new Error("There is no added item database yaml in the app configuration.");
  }

  const [yamlDB, itemInfo] = await Promise.all([loadYamlDB(), loadItemInfo()]);

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

  // Sort by Id for pagination
  itemDB.sort((a, b) => a.Id - b.Id);

  // Insert into a map for caching
  itemDB.forEach((item) => {
    _itemDB.set(item.Id, item);
  });

  return _itemDB;
}

async function loadYamlDB(): Promise<string[]> {
  const files = appConfig.ItemDatabaseYML.filter((item) => {
    const ext = extname(item);
    if (ext !== ".yaml" && ext !== ".yml") {
      console.warn(`loadYamlDB : Invalid extension for the input ${item}`);
      return false;
    }
    return true;
  });

  const data = files.map((item: string) =>
    readFile(`./src/data/item/${item}`, "utf-8")
      .catch((err) => {
        console.warn(`loadYamlDB: Failed to load ${item}: ${err}`);
        return null;
      }),
  );

  const result = await Promise.all(data);
  return result.filter(item => item !== null);
}

async function loadItemInfo(): Promise<string[]> {
  const files = appConfig.ItemDatabaseLUA.filter((item: string) => {
    const ext = extname(item);
    if (ext !== ".lua" && ext !== ".lub") {
      console.warn(`loadItemInfo: Invalid Lua extension for the input ${item}`);
      return false;
    }
    return true;
  });

  const data = files.map(item =>
    readFile(`./src/data/item/${item}`, "utf-8")
      .catch((err) => {
        console.warn(`loadItemInfo: Failed to load ${item}: ${err}`);
        return null;
      }),
  );

  const result = await Promise.all(data);
  return result.filter(item => item !== null);
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

// https://github.com/fstirlitz/luaparse very confusing stuffs
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
              case "StringLiteral":
              case "NumericLiteral":
              case "BooleanLiteral":
                // Added slice since double quotes is always at start/end
                (itemData as any)[propName] = (propValue.raw.slice(1, -1));
                break;

              case "TableConstructorExpression":
                // arrays (mainly for description)
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

// Get item data
export async function getItemInfo(id: number): Promise<ItemDatabaseFormat | null> {
  // Should be cached already at this point.
  const itemDB = await _createItemDatabase();
  return itemDB.get(id) || null;
}

export function getTradeRestrictions(trade: ItemTrade | undefined): string[] {
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
