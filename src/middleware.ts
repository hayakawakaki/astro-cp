import { defineMiddleware } from "astro:middleware";

import { auth } from "@lib/auth/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api
    .getSession({
      headers: context.request.headers,
    })
    .catch((e) => {
      console.error("Middleware Error", e);
      return null;
    });
  if (context.url.pathname === "/" && !isAuthed) {
    return context.redirect("/login");
  }
  return next();
});
