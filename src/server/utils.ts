/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSideHelpers } from "@trpc/react-query/server";
import { v2 as cloudinary } from "cloudinary";
import superjson from "superjson";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { prisma } from "./db";
import { TRPCError } from "@trpc/server";
import type { NextApiResponse } from "next";
import type { Page } from "@prisma/client";
import { includes } from "lodash";
import i18n from "~/i18/config";

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
    throw new TRPCError({
      message: message,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const handleCheckPermission = (userId: string, page: Page) => {
  const isHavePermission =
    page.authorId === userId || includes(page.permissionId, userId);

  if (!isHavePermission) {
    throw new TRPCError({
      message: i18n.t("UNAUTHORIZED"),
      code: "UNAUTHORIZED",
    });
  }
};
