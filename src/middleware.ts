import { defineMiddleware, sequence } from "astro:middleware";

import { auth } from "@/lib/auth/auth";
import config from "~/app-config";

const PROTECTED_ROUTES = ["/account"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login"];

export const setDefaultLocals = defineMiddleware(async (context, next) => {
  context.locals.serverName = config.ServerName;
  const response = await next();
  return response;
});

export const authMiddleware = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith("/assets/")
    || context.url.pathname.startsWith("/_astro/")) {
    return next();
  }

  try {
    const session = context.request.headers
      ? await auth.api.getSession({ headers: context.request.headers })
      : null;

    if (session) {
      context.locals.user = session.user;
      context.locals.session = session.session;

      if (AUTH_ROUTES.includes(context.url.pathname)) {
        return context.redirect("/");
      }
    }
    else {
      context.locals.user = null;
      context.locals.session = null;

      const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        context.url.pathname.startsWith(route),
      );

      if (isProtectedRoute) {
        const redirectUrl = `/login?redirect=${encodeURIComponent(context.url.pathname)}`;
        return context.redirect(redirectUrl);
      }
    }
  }
  catch (error) {
    console.error("[Auth Middleware Error]:", error);
    context.locals.user = null;
    context.locals.session = null;
  }

  return next();
});

export const adminMiddleware = defineMiddleware(async (context, next) => {
  const isAdminRoute = ADMIN_ROUTES.some(route =>
    context.url.pathname.startsWith(route),
  );

  if (!isAdminRoute) {
    return next();
  }

  const user = context.locals.user;

  if (!user) {
    const redirectUrl = `/login?redirect=${encodeURIComponent(context.url.pathname)}`;
    return context.redirect(redirectUrl);
  }

  if (user.role !== "admin" && user.role !== "moderator") {
    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return next();
});

export const onRequest = sequence(
  setDefaultLocals,
  authMiddleware,
  adminMiddleware,
);
