import { boolean, date, index, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, tinyint, varchar } from "drizzle-orm/mysql-core";

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

export const schema = {
  user,
  session,
  account,
  verification,
  loginTable,
  userAccountsTable,
};
