// @ts-check
import { defineConfig } from "astro/config";

import themedComponentIntegration from "./integration/themed-component";

// https://astro.build/config
export default defineConfig({
  integrations: [
    themedComponentIntegration({ theme: "test-theme" }),
  ],
});
