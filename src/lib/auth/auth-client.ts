import type { SocialProvider } from "better-auth/social-providers";

import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

import { ac, admin, moderator, user } from "./permission";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4321",
  fetchOptions: {
    timeout: 10000,
    retry: 2,
    retryDelay: 1000,
  },
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        moderator,
        user,
      },
    }),
  ],
});

async function signIn(targetProvider: SocialProvider) {
  await authClient.signIn.social({ provider: targetProvider });
}

async function signOut() {
  await authClient.signOut();
  window.location.reload();
}

async function promoteToAdmin(userId: string) {
  await authClient.admin.setRole({
    userId,
    role: "admin",
  });
}

async function promoteToModerator(userId: string) {
  await authClient.admin.setRole({
    userId,
    role: "moderator",
  });
}

async function PromotetoUser(userId: string) {
  await authClient.admin.setRole({
    userId,
    role: "user",
  });
}

export { promoteToAdmin, promoteToModerator, PromotetoUser, signIn, signOut };
