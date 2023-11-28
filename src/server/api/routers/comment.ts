import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { handleCheckPermission, handleTryCatchApiAction } from "~/server/utils";
import type { Page } from "@prisma/client";

const schemaComment = z.object({
  content: z.string(),
  pageId: z.string(),
});

export const commentRouter = createTRPCRouter({
  createComment: privateProcedure
    .input(schemaComment)
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.findUnique({
        where: {
          id: input.pageId,
        },
      });
      handleCheckPermission(ctx.currUser, page as Page);

      await handleTryCatchApiAction(async () => {
        await ctx.prisma.comment.create({
          data: {
            content: input.content,
            authorId: ctx.currUser.id,
            pageId: input.pageId,
          },
        });
      });
    }),
  deleteComment: privateProcedure
    .input(z.object({ commentId: z.string(), pageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.findUnique({
        where: {
          id: input.pageId,
        },
      });
      handleCheckPermission(ctx.currUser, page as Page);

      await handleTryCatchApiAction(async () => {
        await ctx.prisma.comment.delete({
          where: {
            id: input.commentId,
          },
        });
      });
    }),
});
