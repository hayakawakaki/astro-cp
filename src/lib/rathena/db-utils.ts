import type { GetDBInfo, GetDBInfoReturn, ItemDatabaseFormat, ItemTrade, ItemType, MobDatabaseFormat, WhoDropFormat } from "@/rathena";
import type { PaginationOption, PaginationReturn } from "@/utils/pagination";

import Pagination from "@/utils/pagination";

import { _getDropDatabase, _getItemDatabase, _tradeDisplay, _typeDisplay } from "./db-item";
import { _getMobDatabase } from "./db-mob";

// = Curried functions
function _createDBGetFunction<DBFormat>(getDB: (value: number | string) => Promise<Map<any, DBFormat> | null>) {
  return async <T extends GetDBInfo<DBFormat> = undefined>(
    value: number | string,
    type?: T,
  ): Promise<GetDBInfoReturn<DBFormat, T> | null> => {
    const db = await getDB(value);
    if (!db)
      return null;

    const data = db.get(value);
    if (!data)
      return null;

    return (type === undefined ? data : data[type]) as GetDBInfoReturn<DBFormat, T>;
  };
}

function _createPaginatedDBFunction<DBFormat>(getDB: () => Promise<Map<any, DBFormat> | null>) {
  return async (options: PaginationOption): Promise<PaginationReturn<DBFormat> | null> => {
    const db = await getDB();
    if (!db)
      return null;

    const pagination = new Pagination(db);
    return pagination.paginize(options);
  };
}

// Mob Database Helpers
export const getMobInfo = _createDBGetFunction<MobDatabaseFormat>(_getMobDatabase);
export const paginatedMobDB = _createPaginatedDBFunction<MobDatabaseFormat>(_getMobDatabase);

export async function searchMob(search: string, limit: number = 10): Promise<MobDatabaseFormat[]> {
  const query = search.toLowerCase();
  if (query.trim() === "") {
    return [];
  }

  const db = await _getMobDatabase();
  const result: MobDatabaseFormat[] = [];

  for (const mob of db.values()) {
    if (mob.Name?.toLowerCase().includes(query) || mob.Id.toString().includes(query)) {
      result.push(mob);
      if (result.length >= limit)
        break;
    }
  }

  return result;
}

// Item Database Helpers
export const getItemInfo = _createDBGetFunction<ItemDatabaseFormat>(_getItemDatabase);
export const paginatedItemDB = _createPaginatedDBFunction<ItemDatabaseFormat>(_getItemDatabase);

export async function whoDrops(itemId: number): Promise<Set<WhoDropFormat> | undefined> {
  const db = await _getDropDatabase();
  if (!db)
    return new Set();

  return db.get(itemId);
}

export async function searchItem(search: string, limit: number = 10): Promise<ItemDatabaseFormat[]> {
  const query = search.toLowerCase();
  if (query.trim() === "") {
    return [];
  }

  const db = await _getItemDatabase();
  const result: ItemDatabaseFormat[] = [];

  for (const item of db.values()) {
    if (item.Name?.toLowerCase().includes(query) || item.Id.toString().includes(query)) {
      result.push(item);
      if (result.length >= limit)
        break;
    }
  }

  return result;
}

export function getItemTypeDisplay(type: ItemType) {
  return _typeDisplay[type] || "Unknown Type";
}

export function getTradeRestrictionsDisplay(trade: ItemTrade | undefined): string | string[] {
  if (!trade)
    return "No Restriction";

  const restrictions: string[] = [];

  Object.entries(_tradeDisplay).forEach(([key, display]) => {
    if (trade[key as keyof ItemTrade]) {
      restrictions.push(display);
    }
  });

  return restrictions;
}

export function getItemData(itemData: ItemDatabaseFormat): Array<{ label: string; value: string | string[] }> {
  if (!itemData)
    return [];

  let keys: string[];
  switch (itemData.Type) {
    case "Weapon":
      keys = ["Id", "Name", "Type", "SubType", "Range", "WeaponLevel", "Slots", "EquipLevelMin", "Refineable", "Gradable", "Locations", "Weight", "Buy", "Sell", "Trade"];
      break;
    case "Armor":
      keys = ["Id", "Name", "Type", "ArmorLevel", "Slots", "EquipLevelMin", "Refineable", "Gradable", "Locations", "Weight", "Buy", "Sell", "Trade"];
      break;
    case "Usable":
      keys = ["Id", "Name", "Type", "EquipLevelMin", "Weight", "Buy", "Sell", "Trade"];
      break;
    case "Card":
      if (itemData.SubType === "Normal") {
        keys = ["Id", "Name", "Type", "Locations", "Weight", "Buy", "Sell", "Trade"];
      }
      else {
        keys = ["Id", "Name", "Type", "SubType", "Weight", "Buy", "Sell", "Trade"];
      }
      break;
    default:
      keys = ["Id", "Name", "Type", "Weight", "Buy", "Sell", "Trade"];
      break;
  }

  const processed: Array<{ label: string; value: string | string[] }> = [];

  keys.forEach((key) => {
    switch (key) {
      case "Type":
        processed.push({ label: "Type", value: getItemTypeDisplay(itemData.Type) });
        break;
      case "SubType":
        processed.push({ label: "Subtype", value: itemData.SubType || "None" });
        break;
      case "EquipLevelMin":
        if (itemData.Type === "Weapon" || itemData.Type === "Armor")
          processed.push({ label: "Level Requirement", value: String(itemData.EquipLevelMin) });
        break;
      case "ArmorLevel":
        if (itemData.Type === "Armor")
          processed.push({ label: "Armor Level", value: String(itemData.ArmorLevel) });
        break;
      case "WeaponLevel":
        if (itemData.Type === "Weapon")
          processed.push({ label: "Weapon Level", value: String(itemData.WeaponLevel) });
        break;
      case "Refineable":
        if (itemData.Type === "Weapon" || itemData.Type === "Armor")
          processed.push({ label: "Refineable", value: itemData.Refineable ? "Yes" : "No" });
        break;
      case "Gradable":
        if (itemData.Type === "Weapon" || itemData.Type === "Armor")
          processed.push({ label: "Gradable", value: itemData.Gradable ? "Yes" : "No" });
        break;
      case "Trade":
        processed.push({ label: "Trade Restriction", value: getTradeRestrictionsDisplay(itemData.Trade) });
        break;
      case "Locations": {
        const loc: string[] = [];
        switch (itemData.Type) {
          case "Weapon": {
            const temp: string[] = [];
            Object.keys(itemData.Locations).map(item => temp.push(item));
            if (temp.includes("Right_Hand") && !temp.includes("Left_Hand"))
              loc.push("One-Handed");
            else
              loc.push("Two-Handed");
            processed.push({ label: "Equip Slot", value: loc });
          } break;

          case "ShadowGear":
            break;
        }
      } break;

      default: {
        const value = itemData[key as keyof ItemDatabaseFormat];
        processed.push({ label: key, value: Array.isArray(value) ? value.map(String) : String(value) });
      } break;
    }
  });

  return processed;
}
