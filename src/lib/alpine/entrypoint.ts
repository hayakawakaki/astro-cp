import Alpine from "alpinejs";

import { signIn, signOut } from "@/lib/auth/auth-client";

import { registerSearchComponent } from "./search";

export default () => {
  registerSearchComponent();
  Alpine.store("auth", {
    signIn,
    signOut,
  });
};
