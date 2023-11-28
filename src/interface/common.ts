import type { GridSize } from "@mui/material";

export interface GridDefaultBreakpoints {
  lg?: boolean | GridSize;
  lgOffset?: GridSize;
  md?: boolean | GridSize;
  mdOffset?: GridSize;
  sm?: boolean | GridSize;
  smOffset?: GridSize;
  xl?: boolean | GridSize;
  xlOffset?: GridSize;
  xs?: boolean | GridSize;
  xsOffset?: GridSize;
}

export interface ILayoutGridBreakpoints {
  label: GridDefaultBreakpoints;
  field: GridDefaultBreakpoints;
}

export interface IErrorCatch {
  message: string;
  code: string | number;
}

export interface ISettingSelectItem {
  label: string;
  value: string;
}

export type OrderType = "asc" | "desc";
