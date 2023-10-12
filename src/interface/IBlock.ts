import type { blockTypes } from "~/utils/utilsBlock";

export interface IBlockType {
  type: string;
  label: string;
}

export type blockTypeList = keyof typeof blockTypes;
