import yaml from "js-yaml";
import fs from "node:fs/promises";

import type { ItemDatabase, ItemDatabaseYaml } from "@/types/item-db.types";

let itemDB: ItemDatabase[] | null = null;

export async function parseItems() {
  // Return if already cached
  if (itemDB !== null)
    return itemDB;

  const [equip, etc, usable] = await Promise.all([
    fs.readFile("./src/data/item_db_equip.yml", "utf8"),
    fs.readFile("./src/data/item_db_etc.yml", "utf8"),
    fs.readFile("./src/data/item_db_usable.yml", "utf8"),
  ]);

  const equipItems = yaml.load(equip) as ItemDatabaseYaml;
  const etcItems = yaml.load(etc) as ItemDatabaseYaml;
  const usableItems = yaml.load(usable) as ItemDatabaseYaml;

  itemDB = [
    ...equipItems.Body,
    ...etcItems.Body,
    ...usableItems.Body,
  ];

  // Sort for pagination
  itemDB.sort((a, b) => a.Id - b.Id);

  return itemDB;
}

export async function getItemInfo(id: number) {
  // Should be cached already at this point.
  const itemDB = await parseItems();
  return itemDB.find(item => item.Id === id);
}
