export type Framework = "vanilla" | "vue" | "react" | "svelte" | "solid";
export type OAuthProvider = "discord" | "google";

export type AuthConfig = {
  baseURL: string;
  fetchOptions?: {
    timeout?: number;
    retry?: number;
    retryDelay?: number;
    headers?: Record<string, string>;
    credentials?: "include" | "omit" | "same-origin";
    onError?: (error: any) => void;
    onSuccess?: (response: any) => void;
  };
  plugins?: any[];
};

export type AuthService = {
  client: any;
  signIn: (provider: OAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  getSession: () => Promise<any>;
  useSession: () => Promise<any>;
};
