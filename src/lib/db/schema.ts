import { boolean, char, date, index, int, mysqlEnum, mysqlTable, primaryKey, smallint, text, timestamp, tinyint, unique, varchar } from "drizzle-orm/mysql-core";

export const user = mysqlTable("cp_user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").$defaultFn(() => false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const session = mysqlTable("cp_session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("cp_account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = mysqlTable("cp_verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()),
});

// Rathena tables
export const loginTable = mysqlTable("login", {
  accountId: int("account_id", { unsigned: true }).autoincrement().primaryKey().notNull(),
  userId: varchar("userid", { length: 23 }).notNull().default(""),
  userPass: varchar("user_pass", { length: 32 }).notNull().default(""),
  sex: mysqlEnum("sex", ["M", "F", "S"]).notNull().default("M"),
  email: varchar("email", { length: 39 }).notNull().default(""),
  groupId: tinyint("group_id").notNull().default(0),
  state: int("state").notNull().default(0),
  unbanTime: int("unban_time").notNull().default(0),
  birthdate: date("birthdate"),
  vipTime: int("vip_time").notNull().default(0),
  uniqueId: int("last_unique_id", { unsigned: true }),
}, table => [
  index("name").on(table.userId),
]);

export const userAccountsTable = mysqlTable("cp_user_accounts", {
  accountId: int("account_id", { unsigned: true }).notNull().references(() => loginTable.accountId, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onDelete: "cascade" }),
}, table => [
  primaryKey({ columns: [table.userId, table.accountId] }),
  index("user_id_idx").on(table.userId),
  index("account_id_idx").on(table.accountId),
]);

export const charTable = mysqlTable("char", {
  charId: int("char_id").autoincrement().notNull(),
  accountId: int("account_id").default(0).notNull(),
  charNum: tinyint("char_num").default(0).notNull(),
  name: varchar({ length: 30 }).default("'").notNull(),
  class: smallint().notNull(),
  baseLevel: smallint("base_level").default(1).notNull(),
  jobLevel: smallint("job_level").default(1).notNull(),
  zeny: int().default(0).notNull(),
  guildId: int("guild_id").default(0).notNull(),
  hair: tinyint().default(0).notNull(),
  hairColor: smallint("hair_color").notNull(),
  clothesColor: smallint("clothes_color").notNull(),
  body: smallint().notNull(),
  weapon: smallint().notNull(),
  shield: smallint().notNull(),
  headTop: smallint("head_top").notNull(),
  headMid: smallint("head_mid").notNull(),
  headBottom: smallint("head_bottom").notNull(),
  robe: smallint().notNull(),
  online: tinyint().default(0).notNull(),
  sex: mysqlEnum(["M", "F"]).notNull(),
}, table => [
  index("account_id").on(table.accountId),
  index("guild_id").on(table.guildId),
  index("online").on(table.online),
  unique("name_key").on(table.name),
]);

export const vendingTable = mysqlTable("vendings", {
  id: int().notNull(),
  accountId: int("account_id").notNull(),
  charId: int("char_id").notNull(),
  sex: mysqlEnum(["F", "M"]).default("M").notNull(),
  map: varchar({ length: 20 }).notNull(),
  x: smallint().notNull(),
  y: smallint().notNull(),
  title: varchar({ length: 80 }).notNull(),
  bodyDirection: char("body_direction", { length: 1 }).default("4").notNull(),
  headDirection: char("head_direction", { length: 1 }).default("0").notNull(),
  sit: char({ length: 1 }).default("1").notNull(),
  autotrade: tinyint().notNull(),
});

export const schema = {
  user,
  session,
  account,
  verification,
  loginTable,
  charTable,
  userAccountsTable,
  vendingTable,
};
