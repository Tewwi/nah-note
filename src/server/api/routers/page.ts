import { TRPCError, getTRPCErrorFromUnknown } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { itemPerPage } from "~/server/constant";
import i18n from "i18next";
import { handleCheckPermission } from "~/server/utils";
import type { Page } from "@prisma/client";

const schemaPage = z.object({
  title: z.string().nullable().optional(),
  authorId: z.string(),
  parentId: z.string().nullable().optional(),
  emoji: z.string().nullable().optional(),
  id: z.string().optional(),
  backgroundCover: z.string().nullable().optional(),
  permissionId: z.array(z.string()).optional(),
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

        const total = await prisma.page.count({
          where: {
            authorId: currUser?.id,
          },
        });

        if (resp.length > limit) {
          const nextItem = resp.pop();
          nextCursor = nextItem!.id;
        }

        return {
          resp,
          nextCursor,
          total: Math.ceil(total / itemPerPage),
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
      if (input.id.length < 1) {
        return;
      }

      try {
        const resp = await ctx.prisma.page.findUnique({
          where: {
            id: input.id,
          },
          include: {
            children: true,
            author: true,
            blocks: true,
            comment: {
              include: {
                author: true,
              },
            },
          },
        });
        handleCheckPermission(ctx.currUser.id, resp as Page);

        return resp;
      } catch (error) {
        const err = getTRPCErrorFromUnknown(error);
        throw new TRPCError({
          message: err.message,
          code: err.code,
        });
      }
    }),
  updatePageById: privateProcedure
    .input(schemaPage)
    .mutation(async ({ ctx, input }) => {
      const { id, ...restData } = input;
      handleCheckPermission(ctx.currUser.id, input as Page);

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
  deletePageById: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const pageInfo = await ctx.prisma.page.findUnique({
          where: {
            id: input.id,
          },
        });
        handleCheckPermission(ctx.currUser.id, pageInfo as Page);

        const resp = await ctx.prisma.page.delete({
          where: {
            id: input.id,
          },
        });

        return resp;
      } catch (error) {
        console.log(error);

        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  searchPageByQuery: privateProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.currUser) {
        return;
      }

      try {
        const resp = await ctx.prisma.page.findMany({
          where: {
            OR: [
              {
                permissionId: { has: ctx.currUser.id },
              },
              {
                authorId: ctx.currUser.id,
              },
            ],
            title: {
              contains: input.query,
              mode: "insensitive",
            },
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
  setPermissionPage: privateProcedure
    .input(z.object({ userIds: z.string(), pageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { pageId, userIds } = input;

      try {
        const page = await ctx.prisma.page.findUnique({
          where: {
            id: pageId,
          },
        });

        handleCheckPermission(ctx.currUser.id, page as Page);
        const permissionArray = page?.permissionId
          ? [...page.permissionId, userIds]
          : [userIds];

        return await ctx.prisma.page.update({
          where: {
            id: page?.id,
          },
          data: {
            permissionId: permissionArray,
          },
        });
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getListPermissionUserById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const res = await ctx.prisma.page.findUnique({
          where: {
            id: input.id,
          },
        });

        handleCheckPermission(ctx.currUser.id, res as Page);
        return await ctx.prisma.user.findMany({
          where: {
            id: { in: res?.permissionId },
          },
          select: {
            userName: true,
            id: true,
            avatar: true,
          },
        });
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  findByPermissionId: privateProcedure
    .input(z.object({ cursor: z.string().nullish(), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const { cursor, page } = input;
      const limit = itemPerPage * page;
      let nextCursor: typeof cursor | undefined = undefined;

      try {
        const page = await ctx.prisma.page.findMany({
          where: {
            permissionId: { has: ctx.currUser.id },
          },
          cursor: cursor ? { id: cursor } : undefined,
        });

        if (page.length > limit) {
          const nextItem = page.pop();
          nextCursor = nextItem!.id;
        }

        const total = await ctx.prisma.page.count({
          where: {
            permissionId: { has: ctx.currUser.id },
          },
        });

        return {
          resp: page,
          nextCursor,
          total,
        };
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
