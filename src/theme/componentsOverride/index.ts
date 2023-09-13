/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Theme } from "@mui/material";
import { merge } from "lodash";
import { Button } from "./Button";
import { CssBaseline } from "./CssBaseline";
import { AppBar } from "./AppBar";
import { Toolbar } from "./Toolbar";
import { Paper } from "./Paper";
import { TextField } from "./TextField";
import { Menu } from "./Menu";
import { Tooltip } from "./Tooltip";
import { Select } from "./Select";

export function componentsOverride(theme: Theme) {
  return merge(
    CssBaseline(),
    Button(),
    AppBar(),
    Toolbar(),
    Tooltip(theme),
    Paper(theme),
    Menu(theme),
    TextField(theme),
    Select(theme)
  );
}
