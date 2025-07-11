import { defineMiddleware } from "astro:middleware";

import { auth } from "@lib/auth/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip auth check during prerendering/build time
  if (!context.request.headers) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;

    if (context.url.pathname === "/login") {
      return context.redirect("/");
    }
  }
  else {
    if (context.url.pathname === "/account") {
      return context.redirect("/");
    }
    context.locals.user = null;
    context.locals.session = null;
  }

  return next();
});
