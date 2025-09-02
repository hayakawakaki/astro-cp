import type { GetDBInfo, GetDBInfoReturn, ItemDatabaseFormat, ItemTrade, MobDatabaseFormat, WhoDropFormat } from "@/rathena";
import type { PaginationOption, PaginationReturn } from "@/utils/pagination";

import Pagination from "@/utils/pagination";

import { _getDropDatabase, _getItemDatabase, _tradeDisplay } from "./db-item";
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

export function getTradeRestrictions(trade: ItemTrade | undefined): string[] {
  if (!trade)
    return [];

  const restrictions: string[] = [];

  Object.entries(_tradeDisplay).forEach(([key, display]) => {
    if (trade[key as keyof ItemTrade]) {
      restrictions.push(display);
    }
  });

  return restrictions;
}

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
