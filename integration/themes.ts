import type { AstroIntegration } from "astro";

import fs from "node:fs/promises";
import path from "node:path";

const INTEGRATION_NAME = "AtelierCP Theme Integration";
const DEFAULT_THEME = "base";

type ThemeIntegration = {
  theme?: string;
};

function themeIntegration({ theme = DEFAULT_THEME }: ThemeIntegration): AstroIntegration {
  /*
  ** Validate and sanitize the name to make sure it doesn't break the integration.
  ** the console only appears in verbose and the user might miss the error...
  ** Should I just throw an error here even in dev so the user just immediately fix the problem?
  */
  if (!theme || typeof theme !== "string") {
    if (import.meta.env.DEV) {
      console.error(`${INTEGRATION_NAME}: Invalid theme parameter. The paramter should be a non-empty string. Defaulting to '${DEFAULT_THEME}' theme.`);
      theme = DEFAULT_THEME;
    }
    else {
      throw new Error(`[${INTEGRATION_NAME}] Invalid theme parameter. The parameter should be a non-empty string.`);
    }
  }
  if (theme.includes("..") || theme.includes("/") || theme.includes("\\")) {
    if (import.meta.env.DEV) {
      console.error(`[${INTEGRATION_NAME}] Invalid theme name: '${theme}'. The parameter shouldn't any path separators. Defaulting to '${DEFAULT_THEME}' theme.`);
      theme = DEFAULT_THEME;
    }
    else {
      throw new Error(`[${INTEGRATION_NAME}] Invalid theme parameter. The paramater shouldn't contain any path separators.`);
    }
  }

  const resolveFile = async (
    pathId: string,
    theme: string,
  ): Promise<string | null> => {
    if (!pathId.startsWith("~theme/"))
      return null;

    // It should read any frontend library supported by Astro
    const extensions = [
      ".astro",
      ".vue",
      ".tsx",
      ".jsx",
      ".svelte",
      ".preact.jsx",
      ".solid.tsx",
    ];

    const componentPath = pathId.replace("~theme/", "").replace(/^\/+/, "");

    if (componentPath.includes("..") || path.isAbsolute(componentPath)) {
      console.error(`[${INTEGRATION_NAME}] Error: Invalid component path "${componentPath}". The theme shouldn't be an absolute or relative path traversal.`);
      return null;
    }

    // Try for all frontend libraries
    for (const ext of extensions) {
      const themePath = path.join("src/themes", theme, `${componentPath}${ext}`);
      try {
        await fs.access(themePath);
        return themePath;
      }
      catch {}
    }

    console.error(`[${INTEGRATION_NAME}] Error: The component ${componentPath} doesn't exist. Defaulting to the '${DEFAULT_THEME}.`);

    // Fallback to default theme when not found, the base theme is built purely in astro so no need for other extension checks.
    if (theme !== DEFAULT_THEME) {
      const basePath = path.join("src/themes", DEFAULT_THEME, `${componentPath}.astro`);
      try {
        await fs.access(basePath);
        return basePath;
      }
      catch {
        throw new Error(`[${INTEGRATION_NAME}] Error: The component ${componentPath} doesn't exist on the given theme and on the ${DEFAULT_THEME}. Does the file exist?`);
      }
    }

    return null;
  };

  return {
    name: INTEGRATION_NAME,

    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: INTEGRATION_NAME,
                enforce: "pre",
                async resolveId(pathId: string) {
                  const resolvedPath = await resolveFile(pathId, theme);
                  if (resolvedPath) {
                    console.warn(`[${INTEGRATION_NAME}] theme file added:`, resolvedPath);
                    const absolutePath = path.resolve(resolvedPath);
                    return absolutePath;
                  }
                  return null;
                },
                async load(pathId: string) {
                  if (pathId.includes(path.join("src", "themes", theme))) {
                    this.addWatchFile(pathId);
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

export default themeIntegration;
