import type { APIRoute } from "astro";

import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { z } from "zod";

import { db, loginTable } from "@/lib/db";

const accountSchema = z.object({
  userid: z.string().min(4).max(23).regex(/^\w+$/),
  password: z.string().min(24).optional(),
  email: z.string().email().max(39),
  sex: z.enum(["M", "F", "S"]).optional().default("M"),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data = accountSchema.parse(body);
    const [isExist] = await db.select().from(loginTable).where(eq(loginTable.userid, data.userid));

    if (isExist) {
      return new Response(JSON.stringify({ error: "Username already taken" }), { status: 409 });
    }

    const randomPassword = crypto.randomBytes(16).toString("base64");

    await db.insert(loginTable).values({
      userid: data.userid,
      userPass: randomPassword,
      email: data.email,
      sex: data.sex,
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
    return new Response(JSON.stringify({ error: "Account creation failed. Please report to an admin." }), { status: 500 });
  }
};
