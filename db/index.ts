import type { MySql2Database } from "drizzle-orm/mysql2";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import env from "../lib/env-schema";

let db: MySql2Database | null;

export async function useDB() {
  if (!db) {
    try {
      const connection = await mysql.createConnection({
        host: env.DB_HOST,
        user: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
      });
      db = drizzle(connection);
    }
    catch (error) {
      console.error("Failed to connect to MySQL database:", error);
      // throw new Error("Database connection failed");
      db = null;
    }
  }
  return db;
}
