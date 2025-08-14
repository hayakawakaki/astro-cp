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
                    const absolutePath = path.resolve(resolvedPath);
                    return absolutePath;
                  }
                  return null;
                },
                async load(id: string) {
                  if (id.includes(path.join("src", "themes", theme))) {
                    this.addWatchFile(id);
                    return null;
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
