import node from "@astrojs/node";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";

import themedComponentIntegration from "./integration/themed-component";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    themedComponentIntegration({ theme: "test-theme" }),
    vue(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
