import type { User } from "@prisma/client";

export interface IComment {
  id: string;
  content: string;
  author: User;
  pageId: string;
}
