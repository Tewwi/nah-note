import { TRPCError } from "@trpc/server";
import i18n from "i18next";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { handleTryCatchApiAction } from "~/server/utils";

export const schemaBlock = z.object({
  type: z.string(),
  pageId: z.string(),
  content: z.string(),
  id: z.string().optional(),
});

export const blockRouter = createTRPCRouter({
  createNewBlock: privateProcedure
    .input(schemaBlock)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.block.create({
          data: {
            type: input.type,
            content: input.content,
            pageId: input.pageId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  updateBlock: privateProcedure
    .input(schemaBlock)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      try {
        await ctx.prisma.block.update({
          where: { id: id },
          data: {
            ...rest,
          },
        });
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  deleteBlock: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await handleTryCatchApiAction(async () => {
        await ctx.prisma.block.delete({ where: { id: input.id } });
      });
    }),

  updateBlocksByPageId: privateProcedure
    .input(
      z.object({
        pageId: z.string(),
        blocks: z.array(z.object({}).merge(schemaBlock)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { pageId, blocks } = input;
      const blockBody = blocks.map((block) => ({
        id: block.id,
        content: block.content,
        type: block.type,
      }));
      const resp = await ctx.prisma.page.update({
        where: {
          id: pageId,
        },
        data: {
          blocks: { deleteMany: {}, create: blockBody },
        },
        include: {
          blocks: true,
        },
      });

      return resp;
    }),
});
