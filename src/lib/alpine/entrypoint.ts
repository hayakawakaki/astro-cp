import Alpine from "alpinejs";

import { signIn, signOut } from "@/lib/auth/auth-client";

export default () => {
  Alpine.store("auth", {
    signIn,
    signOut,
  });
};
