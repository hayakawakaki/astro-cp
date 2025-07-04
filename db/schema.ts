import { date, datetime, index, int, mediumint, mysqlEnum, mysqlTable, tinyint, unique, varchar } from "drizzle-orm/mysql-core";

export const login = mysqlTable("login", {
  accountId: int("account_id").autoincrement().notNull(),
  userid: varchar({ length: 23 }).default("'").notNull(),
  userPass: varchar("user_pass", { length: 32 }).default("'").notNull(),
  sex: mysqlEnum(["M", "F", "S"]).default("M").notNull(),
  email: varchar({ length: 39 }).default("'").notNull(),
  groupId: tinyint("group_id").default(0).notNull(),
  state: int().default(0).notNull(),
  unbanTime: int("unban_time").default(0).notNull(),
  expirationTime: int("expiration_time").default(0).notNull(),
  logincount: mediumint().notNull(),
  lastlogin: datetime({ mode: "string" }).default("NULL"),
  lastIp: varchar("last_ip", { length: 100 }).default("'").notNull(),
  birthdate: date({ mode: "string" }).default("NULL"),
  characterSlots: tinyint("character_slots").default(0).notNull(),
  pincode: varchar({ length: 4 }).default("'").notNull(),
  pincodeChange: int("pincode_change").default(0).notNull(),
  vipTime: int("vip_time").default(0).notNull(),
  oldGroup: tinyint("old_group").default(0).notNull(),
  webAuthToken: varchar("web_auth_token", { length: 17 }).default("NULL"),
  webAuthTokenEnabled: tinyint("web_auth_token_enabled").default(0).notNull(),
  lastUniqueId: int("last_unique_id").default(0).notNull(),
  blockedUniqueId: int("blocked_unique_id").default(0).notNull(),
}, table => [
  index("name").on(table.userid),
  unique("web_auth_token_key").on(table.webAuthToken),
]);
