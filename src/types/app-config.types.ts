import type { SocialProvider } from "better-auth/social-providers";

export type NavLink = {
  label: string;
  url: string;
  external?: boolean;
};

export type NavLinkGroup = {
  label?: string;
  links: NavLink[];
};

export type ConfigNav = Array<NavLink | NavLinkGroup>;

export type ServerStatusOption
  = {
    includeGM: true;
    includeVendor: boolean;
    vipUserLevel: number;
    gepardCheck: boolean;
  }
  | {
    includeGM: false;
    minGMLevel: number;
    includeVendor: boolean;
    vipUserLevel: number;
    gepardCheck: boolean;
  };

export type AppConfig = {
  ServerName: string;
  Theme: string;
  AuthProviders: SocialProvider[];
  NavItem: ConfigNav;
  ItemDatabaseYML: string[];
  ItemDatabaseLUA: string[];
  MobDatabaseYML: string[];
  AccountLink: NavLinkGroup;
  ServerStatusOption: ServerStatusOption;
  [key: string]: any; // For custom values
};
