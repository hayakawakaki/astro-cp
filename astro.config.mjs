import alpinejs from "@astrojs/alpinejs";
import node from "@astrojs/node";
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
  integrations: [themedComponentIntegration({ theme: appConfig.theme }), alpinejs()],
  vite: {
    plugins: [tailwindcss()],
  },
});
