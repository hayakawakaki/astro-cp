import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z, ZodError } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  DB_HOST: z.string().default("127.0.0.1"),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  // Optional Schemas
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

expand(config());

export type EnvSchema = z.infer<typeof EnvSchema>;

try {
  // eslint-disable-next-line node/no-process-env
  EnvSchema.parse(process.env);
}
catch (error) {
  if (error instanceof ZodError) {
    let errorMessage = "Missing required values in .env: \n";
    error.issues.forEach((issue) => {
      errorMessage += `${issue.path[0]}\n`;
    });
    const err = new Error(errorMessage);
    err.stack = "";
    throw e;
  }
  else {
    console.error(error);
  }
}

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);
