import type { Components, Theme } from "@mui/material";

export const Paper = (theme: Theme): Components<Omit<Theme, "components">> => {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          marginTop: "6px",
          border: "1px solid",
          borderRadius: "8px",
          borderColor: theme.palette.secondary.contrastText,
          boxShadow: theme.shadows[2],
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
        },
      },
    },
  };
};
