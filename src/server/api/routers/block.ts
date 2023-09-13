import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { handleTryCatchApiAction } from "~/server/utils";

export const blockRouter = createTRPCRouter({
  createNewBlock: privateProcedure
    .input(
      z.object({
        type: z.string(),
        pageId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await handleTryCatchApiAction(async () => {
        await ctx.prisma.block.create({
          data: {
            type: input.type,
            content: input.content,
            pageId: input.pageId,
          },
        });
      });
    }),
    
  updateBlock: privateProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
        pageId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      await handleTryCatchApiAction(async () => {
        await ctx.prisma.block.update({
          where: { id: id },
          data: {
            ...rest,
          },
        });
      });
    }),

  deleteBlock: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await handleTryCatchApiAction(async () => {
        await ctx.prisma.block.delete({ where: { id: input.id } });
      });
    }),
});
