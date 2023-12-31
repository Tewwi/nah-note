/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSideHelpers } from "@trpc/react-query/server";
import { v2 as cloudinary } from "cloudinary";
import superjson from "superjson";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { prisma } from "./db";
import { TRPCError, getTRPCErrorFromUnknown } from "@trpc/server";
import type { NextApiResponse } from "next";
import type { Page, User } from "@prisma/client";
import { includes } from "lodash";
import i18n from "~/i18/config";
import { Role } from "~/utils/constant";
import type { IChartUserData } from "~/interface/IUser";

export const signCloud = (folderName?: string) => {
  // TODO: CHECK TO MAKE SURE AUTHENTICATED

  // Get the timestamp in seconds
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp: timestamp,
    folder: folderName,
  };

  // Get the signature using the Node.js SDK method api_sign_request
  const signature = cloudinary.utils.api_sign_request(
    params,
    env.SECRET_KEY_CLOUDINARY
  );

  return { timestamp: timestamp.toString(), signature: signature };
};

export const generateSSGHelper = (token: string) => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma: prisma,
      token: token,
      res: {} as NextApiResponse,
    },
    transformer: superjson,
  });
};

export const handleTryCatchApiAction = async (
  callback: () => Promise<any>,
  message: string = "Something went wrong"
) => {
  try {
    await callback();
  } catch (error) {
    const err = getTRPCErrorFromUnknown(error);
    throw new TRPCError({
      message: err.message || message,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const handleCheckPagePermission = (userInfo: User, page: Page) => {
  if (userInfo.role === Role.ADMIN.value) {
    return true;
  }

  const isHavePermission =
    page.authorId === userInfo.id || includes(page.permissionId, userInfo.id);

  if (!isHavePermission) {
    throw new TRPCError({
      message: i18n.t("UNAUTHORIZED"),
      code: "UNAUTHORIZED",
    });
  }
};

export const handleCheckUserBlock = (userInfo: User) => {
  if (userInfo.isBlock) {
    throw new TRPCError({
      message: i18n.t("blockErrorMessage"),
      code: "UNAUTHORIZED",
    });
  }
};

export const handleCheckUserPermission = (
  currUser: User,
  targetUser: string
) => {
  if (currUser.role === Role.ADMIN.value) {
    return true;
  }

  return currUser.id === targetUser;
};

export const handleGetMonthInYear = (arr: IChartUserData[]) => {
  const currMonth = arr.map((item) => item.month);
  const result = Array(12)
    .fill(null)
    .map((_item, index) => {
      if (includes(currMonth, index + 1)) {
        return arr.find((item) => item.month === index + 1);
      }

      return {
        month: index + 1,
        count: 0,
      };
    }) as IChartUserData[];

  return result;
};

export const handleCheckPremiumPermission = (
  user: User,
  condition: boolean
) => {
  if (user.isPremium || user.role === Role.ADMIN.value) {
    return;
  }

  if (!condition) {
    throw new TRPCError({
      message: i18n.t("nonPremiumError"),
      code: "UNAUTHORIZED",
    });
  }
};

export const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};
