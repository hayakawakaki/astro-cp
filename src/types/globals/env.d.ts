/// <reference path="../.astro/types.d.ts" />
declare namespace App {
  type Locals = {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
    serverName: import("../../../app-config").ServerName | "NO NAME";
  };
}

type Window = {
  Alpine: import("alpinejs").Alpine;
};
