import type { AstroIntegration } from "astro";

function preloadDatabase(): AstroIntegration {
  return {
    name: "db-preload",
    hooks: {
      "astro:server:setup": async ({ server }) => {
        try {
          const { createItemDatabase } = await server.ssrLoadModule("/src/lib/rathena/item-db.ts");
          const { createMobDatabase } = await server.ssrLoadModule("/src/lib/rathena/mob-db.ts");
          await createItemDatabase();
          await createMobDatabase();
        }
        catch (err) {
          console.error("[db-preload] : Failed to load DB", err);
        }
      },
    },
  };
}

export default preloadDatabase;
