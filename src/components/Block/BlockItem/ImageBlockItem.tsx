import type { Block } from "@prisma/client";
import React from "react";
import ImageBlockLabelButton from "./ImageBlockLabelButton";
import ImageResizeAble from "~/components/Common/Image/ImageResizeAble";

interface IProps {
  handleChangeValue: (value: string, checkBoxValue?: boolean) => Promise<void>;
  blockData: Block;
}

const ImageBlockItem = (props: IProps) => {
  const { blockData, handleChangeValue } = props;

  if (!blockData.content) {
    return <ImageBlockLabelButton handleChangeValue={handleChangeValue} />;
  }

  return <ImageResizeAble blockData={blockData} />;
};

export default ImageBlockItem;
