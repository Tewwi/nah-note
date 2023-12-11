import type { Page } from "@prisma/client";
import { TRPCError, getTRPCErrorFromUnknown } from "@trpc/server";
import i18n from "i18next";
import { z } from "zod";
import type { IChartUserData } from "~/interface/IUser";
import {
  createTRPCRouter,
  privateAdminProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { itemPerPage } from "~/server/constant";
import { handleCheckPagePermission } from "~/server/utils";

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
        handleCheckPagePermission(ctx.currUser, resp as Page);

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
      handleCheckPagePermission(ctx.currUser, input as Page);

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
          include: {
            author: {
              include: {
                Page: true,
              },
            },
          },
        });

        handleCheckPagePermission(ctx.currUser, pageInfo as Page);
        if (pageInfo?.author.Page.length === 1) {
          throw new TRPCError({
            message: i18n.t("deletePageError"),
            code: "BAD_REQUEST",
          });
        }

        const resp = await ctx.prisma.page.delete({
          where: {
            id: input.id,
          },
        });

        return resp;
      } catch (error) {
        throw new TRPCError({
          message: getTRPCErrorFromUnknown(error)
            ? getTRPCErrorFromUnknown(error).message
            : i18n.t("somethingWrong"),
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

        handleCheckPagePermission(ctx.currUser, page as Page);
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

        handleCheckPagePermission(ctx.currUser, res as Page);
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
  getAllPages: privateAdminProcedure
    .input(
      z.object({
        page: z.number(),
        cursor: z.string().nullish(),
        orderBy: z.string().optional().default("createDate"),
        orderType: z.string().optional().default("asc"),
        query: z.string().optional().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, cursor, orderBy, orderType, query } = input;
      const limit = itemPerPage * page;
      let nextCursor: typeof cursor | undefined = undefined;

      try {
        const [total, resp] = await ctx.prisma.$transaction([
          ctx.prisma.page.count(),
          ctx.prisma.page.findMany({
            where: {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
              [orderBy]: orderType,
            },
            include: {
              author: true,
              comment: true,
            },
          }),
        ]);

        if (resp.length > limit) {
          const nextItem = resp.pop();
          nextCursor = nextItem!.id;
        }

        return {
          data: resp,
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
  getChartData: privateProcedure.query(async ({ ctx }) => {
    try {
      const queryResult = await ctx.prisma.user.aggregateRaw({
        pipeline: [
          {
            $group: {
              _id: {
                month: { $month: "$createDate" },
              },
              count: { $sum: 1 },
            },
          },
        ],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arrayValues = Object.values(queryResult).map((item: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        return { month: item._id.month, count: item.count };
      }) as IChartUserData[];

      return arrayValues;
    } catch (error) {
      throw new TRPCError({
        message: i18n.t("somethingWrong"),
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
