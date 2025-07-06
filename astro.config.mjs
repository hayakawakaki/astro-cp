import node from "@astrojs/node";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import { appConfig } from "./app-config";
import themedComponentIntegration from "./integration/themed-component";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    themedComponentIntegration({ theme: appConfig.theme }),
    vue(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
