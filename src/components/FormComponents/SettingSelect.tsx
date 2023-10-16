import { FormControl, MenuItem, Select, type SelectProps } from "@mui/material";
import type { ISettingSelectItem } from "~/interface/common";

interface IProps extends SelectProps {
  items: ISettingSelectItem[];
  onValueChange: (value: string) => void;
}

const SettingSelect = (props: IProps) => {
  const { items, onValueChange, ...other } = props;

  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: 80,
        height: 30,
        "& .MuiInputBase-root": {
          backgroundColor: (theme) => theme.palette.action.focus,
          ":hover": {
            backgroundColor: (theme) => theme.palette.action.focus,
          },
        },
      }}
      size="small"
    >
      <Select
        variant="filled"
        MenuProps={{
          sx: {
            "&& .Mui-selected": {
              backgroundColor: (theme) =>
                `${theme.palette.action.focus} !important`,
              color: (theme) => theme.palette.primary.main,
              ":hover": {
                backgroundColor: (theme) => theme.palette.action.focus,
              },
            },
          },
        }}
        onChange={(e) => {
          onValueChange(e.target.value as string);
        }}
        {...other}
      >
        {items.map((item) => {
          return (
            <MenuItem
              sx={{
                ":active": {
                  backgroundColor: (theme) => theme.palette.action.focus,
                  color: (theme) => theme.palette.primary.main,
                },
              }}
              value={item.value}
              key={item.value}
            >
              <em style={{ fontSize: "14px" }}>{item.label}</em>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SettingSelect;
