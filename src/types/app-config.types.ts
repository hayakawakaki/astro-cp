import type { Framework } from "@/types";

export type AppConfig = {
  ServerName: string;
  Theme: string;
  AuthFramework: Framework;
  NavItem: { label: string; url: string; external?: boolean }[];
  ItemDatabaseYML: string[];
  ItemDatabaseLUA: string[];
  MobDatabaseYML: string[];
};
