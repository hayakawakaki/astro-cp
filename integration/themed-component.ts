import type { AstroIntegration } from "astro";

import fs from "node:fs/promises";
import path from "node:path";

type ThemedComponent = {
  theme: string;
};

function themedComponentIntegration({ theme }: ThemedComponent): AstroIntegration {
  const resolveThemeComponent = async (
    id: string,
    root: URL,
    theme: string,
  ): Promise<string | null> => {
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

    for (const ext of extensions) {
      const themePath = path.join("src/themes", theme, `${componentPath}${ext}`);
      try {
        await fs.access(themePath);
        return themePath;
      }
      catch {}
    }
    return null;
  };

  return {
    name: "astro-themed-component",

    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: "astro-themed-component",
                enforce: "pre",
                async resolveId(id: string) {
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
