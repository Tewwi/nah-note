import type { Block, User } from "@prisma/client";

export interface IPageForm {
    id: string;
    title: string | null;
    author: User;
    permissionId: string[];
    parentId: string | null;
    emoji: string;
    backgroundCover: string | null;
    blocks: Block[];
}