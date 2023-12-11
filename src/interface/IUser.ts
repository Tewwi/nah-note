import type { Prisma } from "@prisma/client";

export interface IUserInfo {
  email: string;
  userName: string;
  password?: string;
}

export const defaultUserInfo = {
  email: "",
  userName: "",
};

export type UserWithPage = Prisma.UserGetPayload<{
  include: {
    Page: true;
  };
}>;

export interface IChartUserData {
  month: number;
  count: number;
}
