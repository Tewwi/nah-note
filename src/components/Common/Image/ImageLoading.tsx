/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import Image, { type ImageProps } from "next/image";
import { Skeleton } from "@mui/material";

interface Props extends ImageProps {
  loadingCustom: boolean;
  alt: string;
}

const ImageLoading = (props: Props) => {
  const { width, height, loadingCustom } = props;
  return loadingCustom ? (
    <Skeleton
      sx={{
        width: width || "100%",
        height: height || "100%",
      }}
      animation="wave"
    />
  ) : (
    <Image {...props} />
  );
};

export default ImageLoading;
