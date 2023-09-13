/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ClearIcon from "@mui/icons-material/Clear";
import type { TextFieldProps } from "@mui/material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import type { Control, RegisterOptions } from "react-hook-form";
import { useController } from "react-hook-form";

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

const InputTransparent = ({
  control,
  name,
  InputProps,
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
      type={"text"}
      InputProps={{
        endAdornment:
          (clearIcon && !!error && value) || (clearIconHasValue && value) ? (
            <InputAdornment position="end" sx={{ px: "2px", ml: 0 }}>
              {((clearIcon && !!error && value) ||
                (clearIconHasValue && value)) && (
                <IconButton size="small" onClick={() => onChange("")}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ) : undefined,
        sx: {
          bgcolor: "transparent",
          paddingRight: "0px",
          ":hover": {
            backgroundColor: "transparent",
          },
        },
        ...InputProps,
      }}
      {...rest}
    />
  );
};

export default InputTransparent;
