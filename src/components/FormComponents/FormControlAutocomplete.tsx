/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, TextField, Typography } from "@mui/material";
import type { AutocompleteProps, SxProps, TextFieldProps } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import { Controller } from "react-hook-form";
import type { RegisterOptions, Control } from "react-hook-form";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import CloseIcon from "@mui/icons-material/Close";
import type { ILayoutGridBreakpoints } from "~/interface/common";
import { horizontalLayout } from "~/utils/constant";
import { grey } from "@mui/material/colors";

interface Props<T>
  extends Omit<
    AutocompleteProps<any, any, any, any>,
    "renderInput" | "onChange"
  > {
  label: React.ReactNode | string;
  colon?: boolean;
  required?: boolean;
  name: string;
  control: Control<any>;
  rules?: Omit<
    RegisterOptions<any, any>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  options: T[];
  layoutBreakpoint?: ILayoutGridBreakpoints;
  getOptionLabel(option: T): string;
  onChange?: (option: T) => void;
  textFieldProps?: TextFieldProps;
  chipStyle?: SxProps;
}

function FormControlAutocomplete<T>(props: Props<T>) {
  const {
    colon,
    control,
    required,
    label,
    name,
    rules,
    options,
    layoutBreakpoint = horizontalLayout,
    getOptionLabel,
    onChange: onChangeOption,
    textFieldProps,
    chipStyle,
    ...rest
  } = props;

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
            <Typography component="span" color="error">
              *
            </Typography>
          )}
          <span>{colon ? ":" : ""}</span>
        </Typography>
      </Grid>
      <Grid {...layoutBreakpoint.field}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <Autocomplete
                slotProps={{
                  paper: {
                    sx: {
                      mt: "2px",
                    },
                  },
                }}
                clearIcon={
                  <CloseIcon
                    className="svg-fill-all"
                    style={{ color: grey[900] }}
                  />
                }
                popupIcon={
                  <KeyboardArrowLeftIcon
                    style={{
                      rotate: "-90deg",
                      flexShrink: 0,
                      margin: "2px",
                    }}
                  />
                }
                value={value}
                size="small"
                onChange={(e, value) => {
                  onChange(value);

                  if (onChangeOption) {
                    onChangeOption(value);
                  }
                }}
                ChipProps={{
                  sx: {
                    borderRadius: "6px",
                    bgcolor: (theme) => theme.palette.background.paper,
                    color: "primary.main",
                    ...chipStyle,
                  },
                  deleteIcon: (
                    <CloseIcon
                      className="svg-fill-all"
                      style={{ color: grey[50] }}
                    />
                  ),
                }}
                options={options}
                getOptionLabel={getOptionLabel}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    {...params}
                    placeholder={undefined}
                    error={!!error}
                    helperText={error?.message || ""}
                    sx={{
                      "& .MuiAutocomplete-inputRoot": {
                        maxHeight: "150px",
                        overflowY: "auto",
                      },
                    }}
                    {...textFieldProps}
                  />
                )}
                sx={{
                  minHeight: "47px",
                  "& .MuiInputBase-root": {
                    minHeight: "47px",
                    backgroundColor: (theme) => theme.palette.action.focus,
                    ":hover": {
                      backgroundColor: (theme) =>
                        `${theme.palette.action.focus} !important`,
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
                {...rest}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
}

export default FormControlAutocomplete;
