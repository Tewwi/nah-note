import type { Block } from "@prisma/client";
import type { blockTypeList } from "~/interface/IBlock";
import TinyEditor from "../Editor/TinyEditor";
import TodoBlockItem from "./BlockItem/TodoBlockItem";
import ImageBlockItem from "./BlockItem/ImageBlockItem";

interface IProps {
  handleChangeValue: (value: string, checkBoxValue?: boolean) => Promise<void>;
  blockData: Block;
  disable: boolean;
}

const BlockItemByType = (props: IProps) => {
  const { blockData, handleChangeValue, disable } = props;

  switch (blockData.type as blockTypeList) {
    case "todo_list":
      return (
        <TodoBlockItem
          blockData={blockData}
          handleChangeValue={handleChangeValue}
          disable={disable}
        />
      );

    case "image":
      return (
        <ImageBlockItem
          blockData={blockData}
          handleChangeValue={handleChangeValue}
          disable={disable}
        />
      );

    default:
      return (
        <TinyEditor
          value={blockData.content}
          handleChangeValue={handleChangeValue}
          disable={disable}
        />
      );
  }
};

export default BlockItemByType;
