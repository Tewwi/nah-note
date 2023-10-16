/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TextFieldProps } from "@mui/material";
import { Typography } from "@mui/material";
import type { Control, RegisterOptions } from "react-hook-form";
import type { ILayoutGridBreakpoints } from "~/interface/common";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import { horizontalLayout } from "~/utils/constant";
import InputField from "./InputField";

type Props = TextFieldProps & {
  label: React.ReactNode | string;
  colon?: boolean;
  clearIcon?: boolean;
  required?: boolean;
  name: string;
  control: Control<any>;
  rules?: Omit<
    RegisterOptions<any, any>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  regex?: RegExp;
  layoutBreakpoint?: ILayoutGridBreakpoints;
};

const FormControlInput = ({
  colon,
  control,
  required,
  label,
  clearIcon,
  name,
  rules,
  regex,
  layoutBreakpoint = horizontalLayout,
  ...rest
}: Props) => {
  return (
    <Grid
      container
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
    >
      <Grid {...layoutBreakpoint.label}>
        <Typography variant="body1" display="flex" flexWrap="wrap">
          {label}
          {required && (
            <Typography component="span" variant="body1" color="error">
              *
            </Typography>
          )}
          <span>{colon ? ":" : ""}</span>
        </Typography>
      </Grid>
      <Grid {...layoutBreakpoint.field}>
        <InputField
          control={control}
          name={name}
          rules={rules}
          clearIcon={clearIcon}
          margin="none"
          regex={regex}
          {...rest}
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: (theme) => theme.palette.action.focus,
              ":hover": {
                backgroundColor: (theme) => theme.palette.action.focus,
              },
            },
            ...rest.sx,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default FormControlInput;
