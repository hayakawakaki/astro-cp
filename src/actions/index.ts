import { defineAction } from "astro:actions";

import { accountHandler } from "./handlers";
import { accountSchema } from "./schemas";

export const server = {
  createAccount: defineAction({
    accept: "form",
    input: accountSchema.create,
    handler: accountHandler.create,
  }),
};
