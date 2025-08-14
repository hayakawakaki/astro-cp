import yaml from "js-yaml";

import type { MobDatabase, MobDatabaseInput, MobYAMLReturn } from "@/types";

import config from "~/app-config";

import { createYmlLoader } from "./db-loader";
import { addDrop } from "./item-db";

const _mobDB: MobDatabase = new Map();
const _loadYamlDB = createYmlLoader("MobDatabaseYML", "mob");

// Create Database
async function createMobDatabase(): Promise<MobDatabase> {
  if (_mobDB.size > 0) {
    return _mobDB;
  }

  if (!config.MobDatabaseYML.length) {
    throw new Error("There is no added item database yaml in the app configuration.");
  }

  const yamlDB = await _loadYamlDB();
  const mobDB: MobDatabaseInput[] = [];

  yamlDB.forEach((item) => {
    const result = yaml.load(item) as MobYAMLReturn;
    result.Body.map(item => mobDB.push(item));
  });

  // Need sort here for multiple yaml support and pagination
  mobDB.sort((a, b) => a.Id - b.Id);

  mobDB.forEach((item) => {
    _mobDB.set(item.Id, item);
    item.Drops?.forEach((drop) => {
      addDrop(drop.Item, item.Id, drop.Rate);
    });
  });

  return _mobDB;
}

async function getMobDatabase(): Promise<MobDatabase> {
  if (_mobDB.size > 0) {
    return _mobDB;
  }
  return createMobDatabase();
}

async function getMobInfo(id: number): Promise<MobDatabaseInput | null> {
  const itemDB = await getMobDatabase();
  return itemDB.get(id) || null;
}

export { createMobDatabase, getMobDatabase, getMobInfo };
