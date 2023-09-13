import type { Components, Theme } from "@mui/material";

export const AppBar = (): Components<Omit<Theme, "components">> => {
  return {
    MuiAppBar: {
      styleOverrides: {},
    },
  };
};
