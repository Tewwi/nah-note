/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Page } from "@prisma/client";
import { TRPCError, getTRPCErrorFromUnknown } from "@trpc/server";
import i18n from "i18next";
import { z } from "zod";
import type { IChartPageData } from "~/interface/IPage";
import {
  createTRPCRouter,
  privateAdminProcedure,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  itemPerPage,
  maxPageForNonPremium,
  maxPermissionShareForNonPremium,
} from "~/server/constant";
import {
  handleCheckPagePermission,
  handleCheckPremiumPermission,
  handleCheckUserBlock,
} from "~/server/utils";

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
        handleCheckPremiumPermission(
          ctx.currUser,
          ctx.currUser.Page.length + 1 <= maxPageForNonPremium
        );

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
        const err = getTRPCErrorFromUnknown(error);
        throw new TRPCError({
          message: err.message,
          code: err.code,
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
  getPageById: publicProcedure
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

        if (resp?.isPublic) {
          return resp;
        }

        if (!ctx.currUser) {
          throw new TRPCError({
            message: i18n.t("UNAUTHORIZED"),
            code: "UNAUTHORIZED",
          });
        }

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
        const err = getTRPCErrorFromUnknown(error);
        throw new TRPCError({
          message: err.message,
          code: err.code,
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
        const err = getTRPCErrorFromUnknown(error);
        throw new TRPCError({
          message: err.message,
          code: err.code,
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
          include: {
            author: true,
          },
        });

        const targetUser = await ctx.prisma.user.findUnique({
          where: {
            id: userIds,
          },
        });

        if (page) {
          handleCheckPremiumPermission(
            page.author,
            page.permissionId.length + 1 <= maxPermissionShareForNonPremium
          );
        }
        handleCheckPagePermission(ctx.currUser, page as Page);
        handleCheckUserBlock(ctx.currUser);
        if (targetUser) {
          handleCheckUserBlock(targetUser);
        }

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
        const err = getTRPCErrorFromUnknown(error);
        throw new TRPCError({
          message: err.message,
          code: err.code,
        });
      }
    }),
  setPublicPermission: privateProcedure
    .input(z.object({ pageId: z.string(), isPublic: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { pageId } = input;

      try {
        const page = await ctx.prisma.page.findUnique({
          where: {
            id: pageId,
          },
          include: {
            author: true,
          },
        });

        handleCheckPagePermission(ctx.currUser, page as Page);
        handleCheckUserBlock(ctx.currUser);

        return await ctx.prisma.page.update({
          where: {
            id: page?.id,
          },
          data: {
            isPublic: input.isPublic,
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
  removePermissionUser: privateProcedure
    .input(z.object({ userId: z.string(), pageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { pageId, userId } = input;

      try {
        const page = await ctx.prisma.page.findUnique({
          where: {
            id: pageId,
          },
          include: {
            author: true,
          },
        });

        if (ctx.currUser.id !== page?.author.id) {
          throw new TRPCError({
            message: i18n.t("UNAUTHORIZED"),
            code: "UNAUTHORIZED",
          });
        }

        const permissionArray = page?.permissionId
          ? page.permissionId.filter((item) => item !== userId)
          : [];

        return await ctx.prisma.page.update({
          where: {
            id: page?.id,
          },
          data: {
            permissionId: permissionArray,
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
        const err = getTRPCErrorFromUnknown(error);
        throw new TRPCError({
          message: err.message,
          code: err.code,
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
  getChartData: privateProcedure
    .input(
      z.object({
        start: z.date(),
        end: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const queryResult = await ctx.prisma.page.aggregateRaw({
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $gte: [
                        "$createDate",
                        {
                          $dateFromString: {
                            dateString: input.start.toISOString(),
                          },
                        },
                      ],
                    },
                    {
                      $lte: [
                        "$createDate",
                        {
                          $dateFromString: {
                            dateString: input.end.toISOString(),
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createDate" },
                },
                count: { $sum: 1 },
              },
            },
          ],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arrayValues = Object.values(queryResult).map((item: any) => {
          return { date: item._id, count: item.count };
        }) as IChartPageData[];

        return arrayValues.sort((a, b) => {
          const tempA = a.date.split("/").reverse().join("");
          const tempB = b.date.split("/").reverse().join("");
          return tempA > tempB ? 1 : tempA < tempB ? -1 : 0;
        });
      } catch (error) {
        throw new TRPCError({
          message: i18n.t("somethingWrong"),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
