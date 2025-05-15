import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    REDIS_TOKEN: z.string().min(1),
    GOOGLE_EMAILER_USER: z.string().min(1),
    GOOGLE_EMAILER_PASS: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
