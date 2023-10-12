import { useTheme } from "@mui/material";
import type { Block } from "@prisma/client";
import Image from "next/image";
import { Resizable } from "re-resizable";
import React from "react";
import { api } from "~/utils/api";

interface IProps {
  blockData: Block;
}

const ImageResizeAble = (props: IProps) => {
  const theme = useTheme();
  const { content: url, height: imgHeight, width: imgWidth } = props.blockData;
  const { mutate } = api.block.updateBlock.useMutation();

  const [width, setWidth] = React.useState(imgWidth || "300");
  const [height, setHeight] = React.useState(imgHeight || "200");

  return (
    <Resizable
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `solid 1px ${theme.palette.background.paper}`,
        backgroundColor: "transparent",
      }}
      size={{ width, height }}
      onResizeStop={(e, direction, ref) => {
        const newHeight = ref.offsetHeight.toString();
        const newWidth = ref.offsetWidth.toString();

        setWidth(newWidth);
        setHeight(newHeight);
        void mutate({ ...props.blockData, height: newHeight, width: newWidth });
      }}
      maxWidth={"100%"}
    >
      <Image src={url} alt="resize_img" layout="fill" objectFit="contain" />
    </Resizable>
  );
};

export default ImageResizeAble;
