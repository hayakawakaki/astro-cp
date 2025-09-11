import { and, eq, gte, ne, sql } from "drizzle-orm";
import net from "node:net";

import type { OnlineCount, ServerStatusReturn } from "@/types";

import { db } from "@/lib/db";
import { charTable, loginTable, vendingTable } from "@/lib/db/schema";
import env from "@/lib/env-schema";
import config from "~/app-config";

const { ServerStatusOption: options } = config;

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

async function _getOnlineCount(isMapOnline: boolean): Promise<OnlineCount> {
  if (!isMapOnline) {
    return {
      onlineCount: 0,
      totalOnlineCount: 0,
      gmCount: 0,
      vendorCount: 0,
      uniqueCount: 0,
    };
  }

  try {
    // Total Online Count - Ignores config
    const totalResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(charTable)
      .where(eq(charTable.online, 1));
    const totalOnlineCount = totalResult[0]?.count || 0;

    // GM Count - Ignores config
    const gmAccounts = await db
      .select({ accountId: loginTable.accountId })
      .from(loginTable)
      .where(
        and(
          gte(loginTable.groupId, options.minGMLevel),
          ne(loginTable.groupId, options.vipUserLevel),
        ),
      );
    const gmAccountIds = gmAccounts.map(acc => acc.accountId);

    let gmCount = 0;
    if (gmAccountIds.length > 0) {
      const gmResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(charTable)
        .where(
          and(
            eq(charTable.online, 1),
            sql`${charTable.accountId} IN (${sql.join(gmAccountIds, sql`, `)})`,
          ),
        );
      gmCount = gmResult[0]?.count || 0;
    }

    // Autotrader count - Ignores config
    const vendorResult = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${vendingTable.accountId})` })
      .from(vendingTable)
      .innerJoin(charTable, eq(vendingTable.accountId, charTable.accountId))
      .where(
        and(
          eq(vendingTable.autotrade, 1),
          eq(charTable.online, 1),
        ),
      );
    const vendorCount = vendorResult[0]?.count || 0;

    // Unique count - gepardCheck must be true
    let uniqueCount = 0;
    if (options.gepardCheck) {
      const uniqueResult = await db
        .selectDistinct({ uniqueId: loginTable.uniqueId })
        .from(charTable)
        .innerJoin(loginTable, eq(charTable.accountId, loginTable.accountId))
        .where(eq(charTable.online, 1));
      uniqueCount = uniqueResult.length;
    }

    // Calculate online based on setting
    const conditions = [eq(charTable.online, 1)];

    if (!options.includeGM) {
      const gmConfigAccounts = await db
        .select({ accountId: loginTable.accountId })
        .from(loginTable)
        .where(
          and(
            gte(loginTable.groupId, options.minGMLevel),
            ne(loginTable.groupId, options.vipUserLevel),
          ),
        );
      const gmConfigAccountIds = gmConfigAccounts.map(acc => acc.accountId);

      if (gmConfigAccountIds.length > 0) {
        conditions.push(sql`${charTable.accountId} NOT IN (${sql.join(gmConfigAccountIds, sql`, `)})`);
      }
    }

    if (!options.includeVendor) {
      const autoVendors = await db
        .select({ accountId: vendingTable.accountId })
        .from(vendingTable)
        .where(eq(vendingTable.autotrade, 1));

      const autoVendorIds = autoVendors.map(acc => acc.accountId);
      if (autoVendorIds.length > 0) {
        conditions.push(sql`${charTable.accountId} NOT IN (${sql.join(autoVendorIds, sql`, `)})`);
      }
    }

    let onlineCount = 0;
    if (options.gepardCheck) {
      const result = await db
        .selectDistinct({ uniqueId: loginTable.uniqueId })
        .from(charTable)
        .innerJoin(loginTable, eq(charTable.accountId, loginTable.accountId))
        .where(and(...conditions));
      onlineCount = result.length;
    }
    else {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(charTable)
        .where(and(...conditions));
      onlineCount = result[0]?.count || 0;
    }

    return {
      onlineCount,
      totalOnlineCount,
      gmCount,
      vendorCount,
      uniqueCount,
    };
  }
  catch (error) {
    console.error("Error getting detailed online counts:", error);
    return {
      onlineCount: 0,
      totalOnlineCount: 0,
      gmCount: 0,
      vendorCount: 0,
      uniqueCount: 0,
    };
  }
}

async function _getServerStatus(): Promise<ServerStatusReturn> {
  const [loginStatus, charStatus, mapStatus, webStatus] = await Promise.all([
    _checkServerPort(Number(env.LOGIN_PORT)),
    _checkServerPort(Number(env.CHAR_PORT)),
    _checkServerPort(Number(env.MAP_PORT)),
    _checkServerPort(Number(env.WEB_PORT)),
  ]);

  const counts = await _getOnlineCount(mapStatus);

  return {
    loginStatus,
    charStatus,
    mapStatus,
    webStatus,
    ...counts,
  };
}

// Cache values
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

// Create additional caches or edit this if you need shorter cache duration
// new ServerStatusCache(duration in ms);
export const serverStatus = new ServerStatusCache(60000);
