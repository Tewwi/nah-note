import type { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import i18n from "i18next";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { handleTryCatchApiAction, signCloud } from "~/server/utils";
import { defaultAvatar } from "~/utils/constant";
import { createToken } from "~/utils/jwtHelper";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        userName: z.string(),
        password: z.string().min(6),
        avatar: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const salt = await bcrypt.genSalt();
      const newPassword = await bcrypt.hash(input.password, salt);
      const userDetail = (await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })) as User;

      if (userDetail) {
        throw new TRPCError({
          message: i18n.t("registerEmailError"),
          code: "NOT_FOUND",
        });
      }

      await handleTryCatchApiAction(async () => {
        const userCreateResp = await ctx.prisma.user.create({
          data: {
            email: input.email,
            userName: input.userName,
            password: newPassword,
            avatar: input.avatar || defaultAvatar,
          },
        });

        const newPage = await ctx.prisma.page.create({
          data: {
            title: "Untitled",
            authorId: userCreateResp.id,
          },
        });

        await ctx.prisma.block.create({
          data: {
            pageId: newPage.id,
            content: "",
            type: "text",
          },
        });

        return userCreateResp;
      });
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string().min(6),
      })
    )
    .output(
      z.object({
        user: z.object({
          email: z.string(),
          userName: z.string(),
          avatar: z.string().nullable(),
        }),
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const resp = (await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })) as User;

      if (!resp) {
        throw new TRPCError({
          message: i18n.t("notFoundEmail"),
          code: "NOT_FOUND",
        });
      }

      const checkPassword = await bcrypt.compare(input.password, resp.password);

      if (!checkPassword) {
        throw new TRPCError({
          message: i18n.t("confirmPasswordError"),
          code: "UNAUTHORIZED",
        });
      }

      const token = createToken(resp.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userInfo } = resp;

      return {
        user: userInfo,
        token: token,
      };
    }),

  signCloud: publicProcedure
    .input(
      z.object({
        folderName: z.string(),
      })
    )
    .output(
      z.object({
        timestamp: z.string(),
        signature: z.string(),
      })
    )
    .mutation(({ input }) => {
      return signCloud(input.folderName);
    }),
  changePassword: privateProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const checkPassword = await bcrypt.compare(
        input.oldPassword,
        ctx.currUser.password
      );

      if (!checkPassword) {
        throw new TRPCError({
          message: i18n.t("confirmPasswordError"),
          code: "UNAUTHORIZED",
        });
      }

      const salt = await bcrypt.genSalt();
      const newPassword = await bcrypt.hash(input.newPassword, salt);
      await handleTryCatchApiAction(async () => {
        await ctx.prisma.user.update({
          where: {
            id: ctx.currUser.id,
          },
          data: {
            password: newPassword,
          },
        });
      });
    }),
});
