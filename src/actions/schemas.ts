import { z } from "astro:schema";

export const accountSchema = {
  // rAthena account creation schema
  create: z.object({
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
  }).refine(
    data => data.password === data.passwordConfirm,
    {
      message: "Password and confirmation doesn't match",
      path: ["passwordConfirm"],
    },
  ),
};

export type CreateAccount = z.infer<typeof accountSchema.create>;
