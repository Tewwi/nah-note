import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { pageRouter } from "./routers/page";
import { blockRouter } from "./routers/block";
import { commentRouter } from "./routers/comment";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  page: pageRouter,
  block: blockRouter,
  comment: commentRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
