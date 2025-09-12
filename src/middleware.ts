import { defineMiddleware, sequence } from "astro:middleware";

import { auth } from "@/lib/auth/auth";
import config from "~/app-config";

export const setDefaultLocals = defineMiddleware(async (context, next) => {
  context.locals.serverName = config.ServerName;
  return next();
});

export const userRequiredRoute = defineMiddleware(async (context, next) => {
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

export const adminMiddleware = defineMiddleware(async (context, next) => {
  if (!context.request.headers) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  if (context.url.pathname !== "/admin") {
    return next();
  }

  const currentUser = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (!currentUser) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        Location: "/",
      },
    });
  }

  // Check if user has admin or moderator role
  const isAdmin = currentUser.user.role === "admin";

  if (!isAdmin) {
    return new Response("Forbidden", {
      status: 403,
      headers: {
        Location: "/",
      },
    });
  }

  return next();
});

export const onRequest = sequence(
  setDefaultLocals,
  userRequiredRoute,
  adminMiddleware,
);
