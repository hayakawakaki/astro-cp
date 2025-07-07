import type { AuthConfig, AuthService, Framework, OAuthProvider } from "@/types";

import { appConfig } from "@root/app-config";

const defaultConfig: AuthConfig = {
  baseURL: "http://localhost:4321",
  fetchOptions: {
    timeout: 10000,
    retry: 2,
    retryDelay: 1000,
  },
};

async function createAuthService(
  framework: Framework = "vue",
  config: Partial<AuthConfig> = {},
): Promise<AuthService> {
  const clientConfig = { ...defaultConfig, ...config };
  let client: any;
  switch (framework) {
    case "vanillajs": {
      const { createAuthClient } = await import("better-auth/client");
      client = createAuthClient(clientConfig);
    } break;
    case "vue": {
      const { createAuthClient } = await import("better-auth/vue");
      client = createAuthClient(clientConfig);
    } break;
    case "svelte": {
      const { createAuthClient } = await import("better-auth/svelte");
      client = createAuthClient(clientConfig);
    } break;
    default:
      throw new Error(`Unsupported framework: ${framework}.`);
  }
  return {
    client,
    signIn: async (provider: OAuthProvider) => {
      try {
        await client.signIn.social({ provider, callbackURL: "/login" });
      }
      catch (error) {
        console.error(`Failed to sign in with ${provider}:`, error);
      }
    },

    signOut: async () => {
      try {
        await client.signOut();
      }
      catch (error) {
        console.error("Failed to sign out:", error);
      }
    },

    getSession: async () => {
      try {
        return await client.getSession();
      }
      catch (error) {
        console.error("Failed to get session:", error);
      }
    },

    useSession: async () => {
      try {
        return client.useSession();
      }
      catch (error) {
        console.error("Failed to get user session:", error);
      }
    },
  };
}

export const authService = await createAuthService(appConfig.authFramework);
