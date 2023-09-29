import type { Block, User } from "@prisma/client";

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
