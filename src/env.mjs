import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    SECRET_KEY: z.string(),
    SECRET_KEY_CLOUDINARY: z.string(),
    API_KEY_CLOUDINARY: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    STRIPE_SECRET_KEY: z.string(),
    WEBHOOK_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLOUDINARY_API: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().min(1),
    NEXT_PUBLIC_TINY_API_KEY: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_API_PAYMENT_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    //server
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SECRET_KEY: process.env.SECRET_KEY,
    SECRET_KEY_CLOUDINARY: process.env.SECRET_KEY_CLOUDINARY,
    API_KEY_CLOUDINARY: process.env.API_KEY_CLOUDINARY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    //client
    NEXT_PUBLIC_CLOUDINARY_API: process.env.NEXT_PUBLIC_CLOUDINARY_API,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    NEXT_PUBLIC_TINY_API_KEY: process.env.NEXT_PUBLIC_TINY_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_API_PAYMENT_URL:
      process.env.NEXT_PUBLIC_CLOUDINARY_API_PAYMENT_URL,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
