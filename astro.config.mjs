import alpinejs from "@astrojs/alpinejs";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import config from "./app-config";
import preloadrathenadb from "./integration/db-preload";
import theme from "./integration/theme-integration";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    theme({ theme: config.Theme }),
    preloadrathenadb(),
    alpinejs({ entrypoint: "/src/lib/alpine/entrypoint" }),
  ],
  vite: {
    plugins: [tailwindcss()],
    test: {
      environment: "jsdom",
      include: ["tests/**/*.test.ts"],
    },
  },
});
