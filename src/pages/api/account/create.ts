import type { APIRoute } from "astro";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth/auth";
import { db, loginTable, userAccountsTable } from "@/lib/db";

const accountSchema = z.object({
  userId: z.string().min(4).max(23).regex(/^\w+$/),
  password: z.string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .refine(v => !v.includes(" "), {
      message: "Password must not include spaces",
    }),
  passwordConfirm: z.string().min(10),
  email: z.string().email().optional(),
}).refine(
  data => data.password === data.passwordConfirm,
  {
    message: "Password and confirmation doesn't match",
    path: ["passwordConfirm"],
  },
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized request" }), { status: 401 });
    }

    const body = await request.json();
    const data = accountSchema.parse(body);
    const [isExist] = await db.select().from(loginTable).where(eq(loginTable.userId, data.userId));

    if (isExist) {
      return new Response(JSON.stringify({ error: "Username already taken" }), { status: 409 });
    }

    // Insert into rathena login table
    const [insertValues] = await db.insert(loginTable).values({
      userId: data.userId,
      userPass: data.password,
      email: session.user.email,
    }).$returningId();

    // Insert to master account table
    await db.insert(userAccountsTable).values({
      accountId: insertValues.accountId,
      userId: session.user.id,
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Account created successfully",
    }), { status: 201 });
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.errors }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: "Account creation failed" }), { status: 500 });
  }
};
