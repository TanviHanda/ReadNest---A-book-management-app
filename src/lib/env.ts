// env.ts 
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const env = createEnv({
  server: {
    UPLOADTHING_TOKEN: z.string(),
    DATABASE_URL: z.url(),
    AUTH_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    QSTASH_URL: z.string(),
    QSTASH_TOKEN: z.string(),
    QSTASH_CURRENT_SIGNING_KEY: z.string().optional(),
    QSTASH_NEXT_SIGNING_KEY: z.string().optional(),
    RESEND_TOKEN: z.string(),
    PROD_ENDPOINT : z.string(),
  },
  client: {
    NEXT_PUBLIC_API_ENDPOINT: z.url(),
    NEXT_PUBLIC_BASE_URL: z.url(),
  },
  runtimeEnv: {
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    QSTASH_URL:process.env.QSTASH_URL,
   QSTASH_TOKEN:process.env.QSTASH_TOKEN,
   QSTASH_CURRENT_SIGNING_KEY:process.env.QSTASH_CURRENT_SIGNING_KEY,
   QSTASH_NEXT_SIGNING_KEY:process.env.QSTASH_NEXT_SIGNING_KEY,
   RESEND_TOKEN:process.env.RESEND_TOKEN,
    PROD_ENDPOINT:process.env.PROD_ENDPOINT,
  },
});