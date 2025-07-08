import type { AppConfig } from "@/types";

export const appConfig: AppConfig = {
  theme: "default",
  authFramework: "vanillajs",
  passwordlessAuth: true,
} as const;
