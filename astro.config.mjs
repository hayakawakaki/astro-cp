import alpinejs from "@astrojs/alpinejs";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import config from "./app-config";
import preloadDatabase from "./integration/db-preload";
import themedComponentIntegration from "./integration/themed-component";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    themedComponentIntegration({ theme: config.Theme }),
    preloadDatabase(),
    alpinejs(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
