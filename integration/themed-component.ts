import type { AstroIntegration } from "astro";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ThemedComponent = {
  theme: string;
};

function themedComponentIntegration({ theme }: ThemedComponent): AstroIntegration {
  const resolveThemeComponent = async (
    id: string,
    root: URL,
    theme: string,
  ): Promise<string | null> => {
    console.warn(`[astro-themed-component] resolveThemeComponent called with: ${id}`, id);

    if (!id.startsWith("@theme/"))
      return null;

    console.warn("[astro-themed-component] Debug : Starts with @theme");

    const extensions = [
      ".astro",
      ".vue",
      ".tsx",
      ".jsx",
      ".svelte",
      ".preact.jsx",
      ".solid.tsx",
    ];

    const componentPath = id.replace("@theme/", "").replace(/^\/+/, "");
    const rootPath = fileURLToPath(root);

    for (const ext of extensions) {
      const themePath = path.join(rootPath, "src/themes", theme, `${componentPath}${ext}`);
      try {
        await fs.access(themePath);
        return themePath;
      }
      catch (error) {
        console.error(`[astro-themed-component] Error : ${error}`);
      }
    }

    if (theme !== "default") {
      for (const ext of extensions) {
        const defaultPath = path.join(rootPath, "src/themes", "default", `${componentPath}${ext}`);
        try {
          await fs.access(defaultPath);
          return defaultPath;
        }
        catch {}
      }
    }

    return null;
  };

  return {
    name: "astro-themed-component",

    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        console.warn("[astro-themed-component] astro:config:setup hook is running!");

        updateConfig({
          vite: {
            plugins: [
              {
                name: "astro-themed-component",
                enforce: "pre",
                async resolveId(id: string) {
                  console.warn("[astro-themed-component] resolveId called with:", id);
                  const resolvedPath = await resolveThemeComponent(id, config.root, theme);
                  if (resolvedPath) {
                    console.warn("[astro-themed-component] resolved:", resolvedPath);
                    return { id: resolvedPath };
                  }
                  return null;
                },
              },
            ],
          },
        });
      },
    },
  };
}

export default themedComponentIntegration;
