import { MenuItem, MenuList, Paper, Typography } from "@mui/material";
import React from "react";

const MenuChangeType = () => {
  return (
    <Paper>
      <MenuList
        sx={{
          borderRadius: "3px",
          border: (theme) =>
            `1px solid ${theme.palette.secondary.contrastText}`,
        }}
      >
        <MenuItem>
          <Typography variant="caption">test item</Typography>
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

export default MenuChangeType;
