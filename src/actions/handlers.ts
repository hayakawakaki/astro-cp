import type { ActionAPIContext } from "astro:actions";

import { ActionError } from "astro:actions";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db, loginTable, userAccountsTable } from "@/lib/db";

import type { CreateAccount } from "./schemas";

export const accountHandler = {
  create: async function createAccountHandler(
    input: CreateAccount,
    context: ActionAPIContext,
  ) {
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });

    // Active session check
    if (!session) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create an account.",
      });
    }

    // Conflicting username check
    const [isExist] = await db.select().from(loginTable).where(eq(loginTable.userId, input.userId));

    if (isExist) {
      throw new ActionError({
        code: "CONFLICT",
        message: "The username is already taken.",
      });
    }

    // Insert into rathena login table
    const [insertValues] = await db.insert(loginTable).values({
      userId: input.userId,
      userPass: input.password,
      email: session.user.email,
    }).$returningId();

    // Insert to master account table
    await db.insert(userAccountsTable).values({
      accountId: insertValues.accountId,
      userId: session.user.id,
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  },
};
