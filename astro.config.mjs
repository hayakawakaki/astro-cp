import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import config from "./app-config";
import themedComponentIntegration from "./integration/themed-component";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [themedComponentIntegration({ theme: config.Theme })],
  vite: {
    plugins: [tailwindcss()],
  },
});
