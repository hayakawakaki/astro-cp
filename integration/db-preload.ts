import type { AstroIntegration } from "astro";

function preloadDatabase(): AstroIntegration {
  return {
    name: "db-preload",
    hooks: {
      "astro:server:setup": async ({ server }) => {
        try {
          const { createItemDatabase } = await server.ssrLoadModule("/src/lib/rathena/item-db.ts");
          const { createMobDatabase } = await server.ssrLoadModule("/src/lib/rathena/mob-db.ts");
          try {
            await createItemDatabase();
          }
          catch (err) {
            throw new Error("Error loading item database:", err as Error);
          }
          try {
            await createMobDatabase();
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
