import { Button, type ButtonProps, type SxProps } from "@mui/material";
import React from "react";

interface Props extends ButtonProps {
  sx?: SxProps;
}

const BoxClickAble = (props: React.PropsWithChildren<Props>) => {
  const { sx, ...rest } = props;

  return (
    <Button
      sx={{
        "&:hover": {
          bgcolor: (theme) => theme.palette.action.hover,
        },
        color: (theme) => theme.palette.text.secondary,
        ...sx,
      }}
      {...rest}
    >
      {props.children}
    </Button>
  );
};

export default BoxClickAble;
