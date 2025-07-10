import type { AppConfig } from "@/types";

export const appConfig: AppConfig = {
  theme: "default",
  authFramework: "vanillajs",

  // = rAthena DB parsing
  itemDatabaseYML: ["item_db_equip.yml", "item_db_etc.yml", "item_db_usable"],
  itemDatabaseLUA: ["item_db.lua"],
} as const;
