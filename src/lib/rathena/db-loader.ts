import { readFile } from "node:fs/promises";
import { extname } from "node:path";

import { pipe } from "@/utils/global-functions";
import config from "~/app-config";

type FileType = "yml" | "lua";
type LoaderFunction = () => Promise<string[]>;
type DatabaseLoader = (fileType: FileType) => (configKey: string) => (filePath: string) => LoaderFunction;

const _loadDatabase: DatabaseLoader = (fileType: FileType) => (configKey: string) => (folderPath: string) => async (): Promise<string[]> => {
  const validExtensions = _getValidExtensions(fileType);
  const targetConfig = config[configKey];

  if (!Array.isArray(targetConfig)) {
    throw new TypeError(`Config key ${configKey} is not a valid target for loadDatabase, the config should be an array.`);
  }

  const files = targetConfig.filter((item) => {
    const ext = extname(item);
    if (!validExtensions.includes(ext)) {
      // Should I just throw an error here so it gets fixed before build time?
      console.warn(`loadDatabase (${fileType}): Invalid extension for ${item}, expected: ${validExtensions.join(", ")}`);
      return false;
    }
    return true;
  });

  // Same as above
  const data = files.map((item: string) =>
    readFile(`./src/assets/rathena_db/${folderPath}/${item}`, "utf-8")
      .catch((err) => {
        console.warn(`loadDB(${fileType}): Failed to load ${item}: ${err}`);
        return null;
      }),
  );

  const result = await Promise.all(data);
  return result.filter(item => item !== null);
};

function _getValidExtensions(fileType: FileType): string[] {
  const extensionMap: Record<FileType, string[]> = {
    yml: [".yaml", ".yml"],
    lua: [".lua", ".lub"],
  };

  return extensionMap[fileType];
}

function _createLoader(fileType: FileType, configKey: string, folderPath: string): LoaderFunction {
  return pipe(
    (type: FileType) => _loadDatabase(type),
    loader => loader(configKey),
    loader => loader(folderPath),
  )(fileType);
}

function _createYmlLoader(configKey: string, dataPath: string): LoaderFunction {
  return _createLoader("yml", configKey, dataPath);
}

function _createLuaLoader(configKey: string, dataPath: string): LoaderFunction {
  return _createLoader("lua", configKey, dataPath);
}

export const _loadItemDB = _createYmlLoader("ItemDatabaseYML", "item");
export const _loadItemInfo = _createLuaLoader("ItemDatabaseLUA", "item");
export const _loadMobDB = _createYmlLoader("MobDatabaseYML", "mob");
