import type { APIRoute } from "astro";

import type { MobSearch } from "@/types";

import { searchMobs } from "@/lib/rathena";

export const GET: APIRoute = async ({ request, url }) => {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && host && !origin.includes(host)) {
    return new Response("Forbidden", { status: 403 });
  }

  const query = url.searchParams.get("q") || "";

  if (query.length < 2) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const limit = Number(url.searchParams.get("limit") || "5");

  const results = await searchMobs(query, limit);

  if (!results?.length) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const filteredData: MobSearch[] = results.map(item => ({
    id: item.Id,
    name: item.Name,
    aegisName: item.AegisName,
  }));

  return new Response(JSON.stringify(filteredData), {
    headers: { "Content-Type": "application/json" },
  });
};
