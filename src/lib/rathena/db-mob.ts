import yaml from "js-yaml";

import type { MobDatabase, MobDatabaseInput, MobYAMLReturn } from "@/types";

import config from "~/app-config";

import type { JobNames } from "./job-names";

import { createYmlLoader } from "./db-loader";
import { addDrop } from "./item-db";
import { jobNames } from "./job-names";

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

    result.Body.map((value) => {
      const key = value.AegisName.toLowerCase() as JobNames;

      if (jobNames[key] !== key.toLowerCase()) {
        value.AegisName = jobNames[key];
      }
      else {
        value.AegisName = key;
      }

      return mobDB.push(value);
    });
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

// Helper for the db search
async function searchMobs(query: string, limit: number = 10): Promise<MobDatabaseInput[]> {
  const mobDB = await getMobDatabase();
  const searchValue = query.toLowerCase();
  const found: MobDatabaseInput[] = [];

  // for loop to use break
  for (const mob of mobDB.values()) {
    if (mob.Name?.toLowerCase().includes(searchValue) || mob.Id.toString().includes(searchValue)) {
      found.push(mob);
      if (found.length >= limit)
        break;
    }
  }

  return found;
}

export { createMobDatabase, getMobDatabase, getMobInfo, searchMobs };
