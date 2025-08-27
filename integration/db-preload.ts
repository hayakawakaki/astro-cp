import type { AstroIntegration } from "astro";

function preloadDatabase(): AstroIntegration {
  return {
    name: "db-preload",
    hooks: {
      "astro:server:setup": async ({ server }) => {
        try {
          const { _createItemDatabase } = await server.ssrLoadModule("/src/lib/rathena/db-item.ts");
          const { _createMobDatabase } = await server.ssrLoadModule("/src/lib/rathena/db-mob.ts");
          try {
            await _createItemDatabase();
          }
          catch (err) {
            throw new Error("Error loading item database:", err as Error);
          }
          try {
            await _createMobDatabase();
          }
          catch (err) {
            throw new Error("Error loading mob database:", err as Error);
          }
        }
        catch (err) {
          console.error("[db-preload] : Failed to load DB", err);
        }
      },
    },
  };
}

export default preloadDatabase;
