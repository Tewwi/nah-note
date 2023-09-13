import type { Components, Theme } from "@mui/material";
import { alpha } from "@mui/material";

export const TextField = (
  theme: Theme
): Components<Omit<Theme, "components">> => {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            // borderColor: theme.palette.grey[700],
          },
        },
        input: {
          // padding: '11px 12px',
        },
        notchedOutline: {
          borderColor: theme.palette.grey[500],
          borderWidth: "1px !important",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: theme.palette.grey[200],
          overflow: "hidden",
          ":hover": {
            backgroundColor: theme.palette.grey[200],
          },
          "&.Mui-error:hover": {
            backgroundColor: theme.palette.error.lighter,
          },
          "&.Mui-disabled:hover": {
            backgroundColor: alpha(theme.palette.common.black, 0.12),
          },
        },
        error: {
          border: `1px solid ${theme.palette.error.light}`,
          backgroundColor: theme.palette.error.lighter,
          "input:focus": {
            backgroundColor: theme.palette.error.lighter,
          },
          "input:hover": {
            backgroundColor: theme.palette.error.lighter,
          },
        },
        input: {
          padding: "12px",
          ":disabled": {
            WebkitTextFillColor: theme.palette.grey[1000],
          },
        },
        inputSizeSmall: {
          padding: "8px",
          ":disabled": {
            WebkitTextFillColor: theme.palette.grey[1000],
          },
        },
      },
      defaultProps: {
        disableUnderline: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              // background: theme.palette.grey[200],
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiFilledInput-root": {
            padding: "5px 55px 5px 5px !important",
          },
          "& .MuiInputBase-sizeSmall": {
            padding: "5px 55px 5px 10px !important",
          },
        },
        option: {
          '&[aria-selected="true"]': {
            backgroundColor: `${theme.palette.success.lighter} !important`,
            color: `${theme.palette.success.main} !important`,
          },
        },
      },
    },
  };
};
