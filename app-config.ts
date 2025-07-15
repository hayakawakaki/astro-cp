import type { AppConfig } from "@/types/app-config.types";

const appConfig: AppConfig = {
  // General
  Theme: "default",
  AuthFramework: "vanillajs",

  // UI
  NavItem: [
    { label: "Home", url: "/" },
    { label: "Item Database", url: "/item" },
    { label: "Mob Database", url: "/mob" },
    { label: "Rate US", url: "https://ratemyserver.net", external: true },
  ],

  // Database
  ItemDatabaseYML: ["item_db_equip.yml", "item_db_etc.yml", "item_db_usable.yml"],
  ItemDatabaseLUA: ["iteminfo.lua"],
  MobDatabaseYML: ["mob_db.yml"],
} as const;

export default appConfig;
