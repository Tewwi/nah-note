import type { Components, Theme } from "@mui/material";

export const Tooltip = (
  theme: Theme
): Components<Omit<Theme, "components">> => {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.common.black,
          borderRadius: "6px",
        },
        arrow: {
          color: theme.palette.common.black,
        },
      },
    },
  };
};
