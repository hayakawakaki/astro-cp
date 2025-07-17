import type { SocialProvider } from "better-auth/social-providers";

export type AppConfig = {
  ServerName: string;
  Theme: string;
  AuthProviders: SocialProvider[];
  NavItem: { label: string; url: string; external?: boolean }[];
  ItemDatabaseYML: string[];
  ItemDatabaseLUA: string[];
  MobDatabaseYML: string[];
  [key: string]: any;
};
