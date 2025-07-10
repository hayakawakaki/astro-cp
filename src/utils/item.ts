import yaml from "js-yaml";
import luaparse from "luaparse";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

import type { ItemDatabase, ItemDatabaseFormat, ItemInfoInput, ItemInfoLUA, ItemTrade, ItemYAMLReturn } from "@/types/item-db.types";

import { appConfig } from "@root/app-config";

export const itemDB: ItemDatabase = new Map();
const luaDB: ItemInfoLUA = new Map();

// = Helper for default values since defaults are handled in the rathena src
function setItemDefaults(item: ItemDatabaseFormat): ItemDatabaseFormat {
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
function parseItemLua(ast: luaparse.Chunk) {
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
      luaDB.set(itemId, itemData as ItemInfoInput);
    }
  });
}

// YAML/Lua parsing
export async function parseItemData(): Promise<ItemDatabase> {
  // Return if already cached
  if (itemDB.size > 0)
    return itemDB;

  if (!appConfig.itemDatabaseYML.length) {
    throw new Error("There is no added item database yaml in the app configuration.");
  }

  const dbList = [];

  for (let i = 0, j = 0, res; i < appConfig.itemDatabaseYML.length; ++i) {
    const filename = appConfig.itemDatabaseYML[i];
    const extension = extname(filename).toLowerCase();

    if (extension !== ".yaml" && extension !== ".yml") {
      console.warn(`Invalid extension for itemDatabaseYML file: ${filename}. Expected .yml/.yaml. Skipping...`);
      continue;
    }

    try {
      res = await readFile(`./src/data/item/${filename}`, "utf-8");
    }
    catch {
      console.warn(`The item db ${filename} doesn't exist in src/data/item. Skipping...`);
      continue;
    }
    dbList[j] = res;
    j++;
  }

  if (!dbList.length) {
    throw new Error("There is no item db yaml loaded, make sure the yaml file is in the correct folder.");
  }

  for (let i = 0, res; i < appConfig.itemDatabaseLUA.length; ++i) {
    const filename = appConfig.itemDatabaseLUA[i];
    const extension = extname(filename).toLowerCase();

    if (extension !== ".lua" && extension !== ".lub") {
      console.warn(`Invalid extension for itemDatabaseYML file: ${filename}. Expected .yml/.yaml. Skipping...`);
      continue;
    }

    try {
      res = await readFile(`./src/data/item/${filename}`, "utf-8");
    }
    catch {
      console.warn(`The iteminfo lua ${filename} doesn't exist in src/data/item. Skipping...`);
      continue;
    }

    const ast = luaparse.parse(res);
    parseItemLua(ast);
  }

  dbList.forEach((item) => {
    const result = yaml.load(item) as ItemYAMLReturn;

    // Add default values
    const final = result.Body.map(setItemDefaults);

    final.forEach((item) => {
      const info = luaDB.get(item.Id);
      if (info) {
        item.Description = info.identifiedDescriptionName;
        item.Image = info.identifiedResourceName;
      }
      else {
        item.Description = ["No description added."];
        item.Image = "NoImage";
      }
      itemDB.set(item.Id, item);
    });
  });

  return itemDB;
}

export async function getItemInfo(id: number): Promise<ItemDatabaseFormat | null> {
  // Should be cached already at this point.
  const itemDB = await parseItemData();
  return itemDB.get(id) || null;
}

// Helper for UI display
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
