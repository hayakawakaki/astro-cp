import { glob } from "glob";
import fs from "node:fs/promises";
import path from "node:path";
import { describe, it } from "vitest";

import config from "../app-config";

describe("validate theme integration imports", () => {
  it("should validate all ~theme imports that exist in the src folder", async () => {
    const files = await glob("src/**/*.{astro,tsx,jsx,vue,svelte}", {
      ignore: [
        "src/actions/**",
        "src/assets/**",
        "src/lib/**",
        "src/types/**",
        "src/utils/**",
        "src/middleware.ts",
      ],
    });

    const errors: string[] = [];
    const themeImportRegex = /from\s+['"]~theme\/([^'"]+)['"]/g;
    const theme = config.Theme || "base";

    for (const file of files) {
      const content = await fs.readFile(file, "utf-8");
      const matches = [...content.matchAll(themeImportRegex)];

      for (const match of matches) {
        const componentPath = match[1];
        const extensions = [".astro", ".vue", ".tsx", ".jsx", ".svelte", ".preact.jsx", ".solid.tsx"];

        let found = false;

        if (theme !== "base") {
          for (const ext of extensions) {
            const themePath = path.join("src/themes", theme, `${componentPath}${ext}`);
            try {
              await fs.access(themePath);
              found = true;
              break;
            }
            catch {}
          }
        }

        if (!found) {
          const basePath = path.join("src/themes/base", `${componentPath}.astro`);
          try {
            await fs.access(basePath);
            found = true;
          }
          catch {}
        }

        if (!found) {
          if (theme !== "base") {
            errors.push(`${file}: Import '~theme/${componentPath}' is not found in the theme '${theme} and in the default theme!'`);
          }
          else {
            errors.push(`${file}: Import '~theme/${componentPath}' is not found the default theme!'`);
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(`Found ${errors.length} missing theme imports: \n ${errors.map(err => ` - ${err}`).join("\n")}`);
    }
  });
});
