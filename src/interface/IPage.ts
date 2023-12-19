import type { Block, Prisma, User } from "@prisma/client";

export interface IPageForm {
  id: string;
  title: string | null;
  author: User;
  authorId: string;
  permissionId: string[];
  parentId: string | null;
  emoji: string | null | undefined;
  backgroundCover: string | null;
  blocks: Block[];
}

export interface IAdminCreatePage {
  title?: string;
  author: User | null;
}

export interface IChartPageData {
  date: string;
  count: number;
}

export type PageFullPackage = Prisma.PageGetPayload<{
  include: {
    author: true;
    comment: true;
    blocks: true;
  };
}>;
