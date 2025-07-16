import type { SocialProvider } from "better-auth/social-providers";

import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4321",
  fetchOptions: {
    timeout: 10000,
    retry: 2,
    retryDelay: 1000,
  },
});

async function signIn(targetProvider: SocialProvider) {
  await authClient.signIn.social({ provider: targetProvider });
}

const signOut = authClient.signOut;

export { signIn, signOut };
