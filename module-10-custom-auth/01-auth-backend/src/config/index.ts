import { z } from 'zod';

const envSchema = z.object({
  MONGO_URI: z.url({ protocol: /mongodb/ }),
  DB_NAME: z.string().default('blogpost'),
  SALT_ROUNDS: z.coerce.number().default(10),
  ACCESS_JWT_SECRET: z
    .string({
      error:
        'ACCESS_JWT_SECRET is required and must be at least 64 characters long',
    })
    .min(64),
  PORT: z.int().default(3000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    z.prettifyError(parsedEnv.error),
  );
  process.exit(1);
}

export const { ACCESS_JWT_SECRET, DB_NAME, MONGO_URI, SALT_ROUNDS, PORT } =
  parsedEnv.data;
