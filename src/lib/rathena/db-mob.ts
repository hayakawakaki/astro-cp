import yaml from "js-yaml";

import type { JobNames, MobDatabase, MobDatabaseFormat, MobYAMLReturn } from "@/rathena";

import config from "~/app-config";

import { jobNames } from "./client-jobnames";
import { _addDrop } from "./db-item";
import { createYmlLoader } from "./db-loader";

const _mobDB: MobDatabase = new Map();
const _loadYamlDB = createYmlLoader("MobDatabaseYML", "mob");

// Create Database
export async function _createMobDatabase(): Promise<MobDatabase> {
  if (_mobDB.size > 0) {
    return _mobDB;
  }

  if (!config.MobDatabaseYML.length) {
    throw new Error("There is no added item database yaml in the app configuration.");
  }

  const yamlDB = await _loadYamlDB();
  const mobDB: MobDatabaseFormat[] = [];

  yamlDB.forEach((item) => {
    const result = yaml.load(item) as MobYAMLReturn;

    result.Body.map((value) => {
      // get the sprite it uses in the client-jobnames
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
      _addDrop(drop.Item, item.Id, drop.Rate);
    });
  });

  return _mobDB;
}

export async function _getMobDatabase(): Promise<MobDatabase> {
  if (_mobDB.size > 0) {
    return _mobDB;
  }
  return _createMobDatabase();
}
