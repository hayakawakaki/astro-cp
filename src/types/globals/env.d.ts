/// <reference path="../.astro/types.d.ts" />
declare namespace App {
  type Locals = {
    user: import("@/lib/auth/auth-client").User | null;
    session: import("@/lib/auth/auth-client").Session | null;
    serverName: import("~/app-config").ServerName | "NO NAME";
  };
}

type Window = {
  Alpine: import("alpinejs").Alpine;
};
