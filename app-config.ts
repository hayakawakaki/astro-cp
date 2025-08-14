import type { AppConfig } from "@/types/app-config.types";

const appConfig: AppConfig = {
  // General
  Theme: "default",
  AuthProviders: ["discord"],

  // Server Details
  ServerName: "AtelierCP",

  // Navigation
  NavItem: [
    { label: "Home", url: "/" },
    { label: "Download", url: "/download" },
    { label: "Wiki", url: "/wiki" },
    {
      label: "Database",
      links: [
        { label: "Item Database", url: "/item" },
        { label: "Mob Database", url: "/mob" },
        { label: "Enchant Database", url: "/enchant" },
      ],
    },
  ],

  AccountLink: {
    label: "Account",
    links: [
      { label: "View Accounts", url: "/dashboard" },
      { label: "Purchase History", url: "/history" },
    ],
  },

  // Database
  ItemDatabaseYML: ["item_db_equip.yml", "item_db_etc.yml", "item_db_usable.yml"],
  ItemDatabaseLUA: ["iteminfo.lua"],
  MobDatabaseYML: ["mob_db.yml"],
} as const;

export default appConfig;
