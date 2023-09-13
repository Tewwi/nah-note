import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { pageRouter } from "./routers/page";
import { blockRouter } from "./routers/block";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  page: pageRouter,
  block: blockRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
