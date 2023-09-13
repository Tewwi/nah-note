import { Button, CircularProgress } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import React from "react";

interface Props extends ButtonProps {
  loading?: boolean;
  title: string;
}

const LoadingButton = (props: Props) => {
  const { loading, title, ...rest } = props;

  return (
    <Button disabled={loading} {...rest}>
      {loading && (
        <>
          <CircularProgress size={14} /> &nbsp;
        </>
      )}
      {title}
    </Button>
  );
};

export default LoadingButton;
