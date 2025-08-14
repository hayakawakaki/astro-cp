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

export type AppConfig = {
  ServerName: string;
  Theme: string;
  AuthProviders: SocialProvider[];
  NavItem: ConfigNav;
  ItemDatabaseYML: string[];
  ItemDatabaseLUA: string[];
  MobDatabaseYML: string[];
  AccountLink: NavLinkGroup;
};
