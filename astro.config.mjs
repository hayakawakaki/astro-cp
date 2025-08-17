import alpinejs from "@astrojs/alpinejs";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import config from "./app-config";
import preloadDatabase from "./integration/db-preload";
import themeIntegration from "./integration/themes";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    themeIntegration({ theme: config.Theme }),
    preloadDatabase(),
    alpinejs(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
