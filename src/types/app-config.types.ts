import type { SocialProvider } from "better-auth/social-providers";
import type { Component } from "vue";

export type NavLink
= | {
  label: string;
  url: string;
  external?: boolean;
  action?: never;
}
| {
  label: string;
  action: string;
  url?: never;
  external?: never;
};

export type NavLinkGroup = {
  label?: string;
  links: NavLink[];
};

export type ConfigNav = Array<NavLink | NavLinkGroup>;

export type ServerInfo = {
  type: "Classic" | "Pre-Renewal" | "Renewal";
  maxLevel: number;
  maxJob: number;
  rates: {
    exp: number;
    drop: number;
    card: number;
  };
};

export type ServerStatusOption = {
  includeGM: boolean;
  minGMLevel: number;
  includeVendor: boolean;
  vipUserLevel: number;
  gepardCheck: boolean;
};

export type AppConfig = {
  ServerName: string;
  ServerInfo: ServerInfo;
  Theme: string;
  AuthProviders: { provider: SocialProvider; icon: Component }[];
  NavItem: ConfigNav;
  ItemDatabaseYML: string[];
  ItemDatabaseLUA: string[];
  MobDatabaseYML: string[];
  AccountLink: NavLinkGroup;
  ServerStatusOption: ServerStatusOption;
  [key: string]: any; // For custom values
};
