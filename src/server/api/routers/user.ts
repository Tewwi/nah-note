import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { handleTryCatchApiAction, signCloud } from "~/server/utils";
import { createToken } from "~/utils/jwtHelper";
import type { User } from "@prisma/client";
import { defaultAvatar } from "~/utils/constant";
import { textContent } from "~/TextContent/text";

export const userRouter = createTRPCRouter({
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
          message: textContent.registerEmailError,
          code: "INTERNAL_SERVER_ERROR",
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

        await ctx.prisma.page.create({
          data: {
            title: 'Untitled',
            authorId: userCreateResp.id,
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
          message: "Not found email",
          code: "NOT_FOUND",
        });
      }

      const checkPassword = await bcrypt.compare(input.password, resp.password);

      if (!checkPassword) {
        throw new TRPCError({
          message: "Password not match",
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

  getUserDetail: privateProcedure.query(({ ctx }) => {
    if (ctx.currUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userInfo } = ctx.currUser;
      return userInfo;
    } else {
      throw new TRPCError({
        message: "Something went wrong !",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
