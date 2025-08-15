import { and, eq, gte, ne, notInArray, sql } from "drizzle-orm";
import net from "node:net";

import type { ServerStatusReturn } from "@/types";

import { db } from "@/lib/db";
import { charTable, loginTable, vendingTable } from "@/lib/db/schema";
import env from "@/lib/env-schema";
import config from "~/app-config";

async function _checkServerPort(port: number): Promise<boolean> {
  const timeout = 5000;

  return new Promise((resolve) => {
    const socket = new net.Socket();

    const timer = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeout);

    socket.on("connect", () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(true);
    });

    socket.on("error", () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, env.SERVER_HOST);
  });
}

async function _getOnlineCount(isMapOnline: boolean): Promise<number> {
  if (!isMapOnline) {
    return 0;
  }

  try {
    const conditions = [eq(charTable.online, 1)];

    if (!config.ServerStatusOption.includeGM) {
      const gmAccounts = await db
        .select({ accountId: loginTable.accountId })
        .from(loginTable)
        .where(
          and(
            gte(loginTable.groupId, config.ServerStatusOption.minGMLevel),
            ne(loginTable.groupId, config.ServerStatusOption.vipUserLevel),
          ),
        );

      const gmAccountIds = gmAccounts.map(acc => acc.accountId);

      if (gmAccountIds.length > 0) {
        conditions.push(notInArray(charTable.accountId, gmAccountIds));
      }
    }

    if (!config.ServerStatusOption.includeVendor) {
      const autoVendors = await db
        .select({ accountId: vendingTable.accountId })
        .from(vendingTable)
        .where(eq(vendingTable.autotrade, 1));

      const autoVendorIds = autoVendors.map(acc => acc.accountId);
      if (autoVendorIds.length > 0) {
        conditions.push(notInArray(charTable.accountId, autoVendorIds));
      }
    }

    if (config.ServerStatusOption.gepardCheck) {
      const result = await db
        .selectDistinct({ uniqueId: loginTable.uniqueId })
        .from(charTable)
        .innerJoin(loginTable, eq(charTable.accountId, loginTable.accountId))
        .where(and(...conditions));
      return result.length;
    }
    else {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(charTable)
        .where(and(...conditions));
      return result[0]?.count || 0;
    }
  }
  catch {
    return 0;
  }
}

async function _getServerStatus(): Promise<ServerStatusReturn> {
  // Check all servers in parallel
  const [loginStatus, charStatus, mapStatus] = await Promise.all([
    _checkServerPort(Number(env.LOGIN_PORT)),
    _checkServerPort(Number(env.CHAR_PORT)),
    _checkServerPort(Number(env.MAP_PORT)),
  ]);

  // Only get player count if map server is online
  const onlineCount = await _getOnlineCount(mapStatus);

  return {
    loginStatus,
    charStatus,
    mapStatus,
    onlineCount,
  };
}

// = Cache status value
class ServerStatusCache {
  private cache: ServerStatusReturn | null = null;
  private lastFetch: number = 0;
  private cacheDuration: number;

  constructor(cacheDurationMs: number = 30000) {
    this.cacheDuration = cacheDurationMs;
  }

  async getStatus(): Promise<ServerStatusReturn> {
    const now = Date.now();

    if (this.cache && (now - this.lastFetch) < this.cacheDuration) {
      return this.cache;
    }

    this.cache = await _getServerStatus();
    this.lastFetch = now;

    return this.cache;
  }
}

// = Create dedicated caches to your needs or just reuse this one
export const serverStatus = new ServerStatusCache(30000);
