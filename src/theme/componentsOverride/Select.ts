import type { Components, Theme } from "@mui/material";

export const Select = (theme: Theme): Components<Omit<Theme, "components">> => {
  return {
    MuiSelect: {
      styleOverrides: {
        select: {
          "&.Mui-disabled": {
            WebkitTextFillColor: theme.palette.grey[1000],
          },
        },
      },
    },
  };
};
