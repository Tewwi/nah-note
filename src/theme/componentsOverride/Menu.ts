import type { Components, Theme } from "@mui/material";
import { green } from "../colors";

export const Menu = (theme: Theme): Components<Omit<Theme, "components">> => {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ":active": {
            backgroundColor: theme.palette.success.lighter,
            color: theme.palette.success.main,
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.success.lighter,
            color: theme.palette.success.main,
            ":hover": {
              backgroundColor: green[300],
            },
          },
        },
      },
    },
  };
};
