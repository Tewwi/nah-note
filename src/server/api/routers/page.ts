import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { itemPerPage } from "~/server/constant";
import i18n from "i18next";

const schemaPage = z.object({
  title: z.string().nullable().optional(),
  authorId: z.string(),
  parentId: z.string().nullable().optional(),
  emoji: z.string().nullable().optional(),
  id: z.string().optional(),
  backgroundCover: z.string().nullable().optional(),
});

export const pageRouter = createTRPCRouter({
  createNewPage: privateProcedure
    .input(schemaPage)
    .mutation(async ({ ctx, input }) => {
      try {
        const resp = await ctx.prisma.page.create({
          data: {
            title: input.title,
            authorId: input.authorId,
            parentId: input.parentId,
          },
        });

        await ctx.prisma.block.create({
          data: {
            content: "",
            type: "text",
            pageId: resp.id,
          },
        });

        return resp;
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getPageByCurrUser: privateProcedure
    .input(
      z.object({
        page: z.number(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { currUser, prisma } = ctx;
      const { page, cursor } = input;
      const limit = itemPerPage * page;
      let nextCursor: typeof cursor | undefined = undefined;

      try {
        const resp = await prisma.page.findMany({
          take: limit + 1,
          where: {
            authorId: currUser?.id,
          },
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            children: true,
            author: true,
          },
        });

        if (resp.length > limit) {
          const nextItem = resp.pop();
          nextCursor = nextItem!.id;
        }

        return {
          resp,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getPageById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const resp = await ctx.prisma.page.findUnique({
          where: {
            id: input.id,
          },
          include: {
            children: true,
            author: true,
            blocks: true,
          },
        });

        return resp;
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  updatePageById: privateProcedure
    .input(schemaPage)
    .mutation(async ({ ctx, input }) => {
      const { id, ...restData } = input;
      try {
        const resp = await ctx.prisma.page.update({
          where: {
            id: id,
          },
          data: {
            ...restData,
          },
        });

        return resp;
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
