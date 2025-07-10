import yaml from "js-yaml";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

import type { ItemDatabase, ItemDatabaseYaml } from "@/types/item-db.types";

import { appConfig } from "@root/app-config";

const itemDB: ItemDatabase[] = [];

export async function parseItems() {
  // Return if already cached
  if (itemDB.length > 0)
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

  dbList.forEach((item) => {
    const result = yaml.load(item) as ItemDatabaseYaml;
    itemDB.push(...result.Body);
  });

  // Sort for pagination
  itemDB.sort((a, b) => a.Id - b.Id);

  return itemDB;
}

export async function getItemInfo(id: number) {
  // Should be cached already at this point.
  const itemDB = await parseItems();
  return itemDB.find(item => item.Id === id);
}
