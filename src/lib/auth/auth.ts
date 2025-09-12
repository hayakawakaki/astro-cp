import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";

import { db } from "@/lib/db";
import { schema } from "@/lib/db/schema";
import env from "@/lib/env-schema";

import { ac, admin, moderator, user } from "./permission";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID as string,
      clientSecret: env.DISCORD_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        moderator,
        user,
      },
      adminUserIds: env.ADMIN_ID.split(",") || [],
    }),
  ],
});
