import { TRPCError, getTRPCErrorFromUnknown } from "@trpc/server";
import i18n from "i18next";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { maxBlockForNonPremium } from "~/server/constant";
import {
  handleCheckPremiumPermission,
  handleTryCatchApiAction,
} from "~/server/utils";

export const schemaBlock = z.object({
  type: z.string(),
  pageId: z.string(),
  content: z.string(),
  id: z.string().optional(),
  todo_checked: z.boolean().optional(),
  height: z.string().nullable().optional(),
  width: z.string().nullable().optional(),
  updateDate: z.date().nullable().optional(),
});

export const blockRouter = createTRPCRouter({
  createNewBlock: privateProcedure
    .input(schemaBlock)
    .mutation(async ({ ctx, input }) => {
      try {
        const page = await ctx.prisma.page.findUnique({
          where: {
            id: input.pageId,
          },
          include: {
            blocks: true,
          },
        });

        if (!page) {
          throw new TRPCError({
            message: i18n.t("Not Found"),
            code: "NOT_FOUND",
          });
        }

        handleCheckPremiumPermission(
          ctx.currUser,
          page.blocks.length + 1 <= maxBlockForNonPremium
        );

        return await ctx.prisma.block.create({
          data: {
            type: input.type,
            content: input.content,
            pageId: input.pageId,
          },
        });
      } catch (error) {
        const err = getTRPCErrorFromUnknown(error);
        throw new TRPCError({
          message: err.message,
          code: err.code,
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
