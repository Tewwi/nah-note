import type { Components, Theme } from "@mui/material";

export const Toolbar = (): Components<Omit<Theme, "components">> => {
  return {
    MuiToolbar: {
      styleOverrides: {
        dense: {
          height: 60,
          minHeight: 60,
        },
      },
    },
  };
};
