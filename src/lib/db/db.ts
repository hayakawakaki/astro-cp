import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import env from "@lib/env-schema";

const connection = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  idleTimeout: 60000,
  connectionLimit: 30,
});

export const db = drizzle({ client: connection });
