/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Control, RegisterOptions } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { useController } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type Props = TextFieldProps & {
  name: string;
  clearIcon?: boolean;
  clearIconHasValue?: boolean;
  control: Control<any>;
  rules?: Omit<
    RegisterOptions<any, any>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  regex?: RegExp;
};

const InputField = ({
  control,
  name,
  InputProps,
  inputProps,
  type = "text",
  rules,
  clearIconHasValue = false,
  clearIcon = false,
  regex,
  ...rest
}: Props) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      name={name}
      value={value || ""}
      onChange={(e) => {
        if (e.target.value && regex && !regex.test(e.target.value)) {
          return;
        }
        onChange(e.target.value);
      }}
      onBlur={onBlur}
      inputRef={ref}
      variant="filled"
      error={!!error}
      helperText={error?.message || ""}
      inputProps={{
        autoComplete: type === "password" ? "new-password" : undefined,
        ...inputProps,
      }}
      type={showPassword ? "text" : type}
      InputProps={{
        endAdornment:
          (type === "password" && value) ||
          (clearIcon && !!error && value) ||
          (clearIconHasValue && value) ? (
            <InputAdornment position="end" sx={{ px: "2px", ml: 0 }}>
              {type === "password" && value && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )}

              {((clearIcon && !!error && value) ||
                (clearIconHasValue && value)) && (
                <IconButton size="small" onClick={() => onChange("")}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ) : undefined,
        style: { paddingRight: 0 },
        ...InputProps,
      }}
      {...rest}
    />
  );
};

export default InputField;
