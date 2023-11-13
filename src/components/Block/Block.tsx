import AddIcon from "@mui/icons-material/Add";
import { CircularProgress, IconButton, Stack } from "@mui/material";
import type { Block as IBlock } from "@prisma/client";
import { Block } from "@prisma/client";
import { memo, useCallback, useMemo, useState } from "react";
import type { blockTypeList } from "~/interface/IBlock";
import { api } from "~/utils/api";
import {
  createBlockItemByType,
  handleChangeContentByType,
} from "~/utils/utilsBlock";
import { SortableItem } from "../../context/BlockDnDProvider";
import BlockItemByType from "./BlockItemByType";
import Draghandler from "./Draghandler";

interface Props {
  pageId: string;
  blockData: Block;
  handleAddBlock: () => Promise<void>;
  handleDeleteBlock: (id: string) => Promise<void>;
  isLoading: boolean;
  isLast: boolean;
  handleChangeValueFieldArr: (index: number, value: IBlock) => void;
  index: number;
  disable: boolean;
}

const Block = (props: Props) => {
  const {
    handleAddBlock,
    blockData,
    handleDeleteBlock,
    isLoading,
    isLast,
    index,
    handleChangeValueFieldArr,
    disable,
  } = props;
  const { mutateAsync: updateBlock } = api.block.updateBlock.useMutation();
  const [isHover, setIsHover] = useState(false);
  const isHiddenDeleteBtn = useMemo(
    () => isLast && index === 0,
    [index, isLast]
  );

  const handleChangeValue = useCallback(
    async (value: string, checkBoxValue?: boolean) => {
      const newValue = {
        ...blockData,
        content: value,
        todo_checked: checkBoxValue ? checkBoxValue : blockData.todo_checked,
      };

      handleChangeValueFieldArr(index, newValue);
      await updateBlock(newValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockData]
  );

  const handleChangeType = useCallback(
    async (type: blockTypeList) => {
      const newContent = createBlockItemByType(
        type,
        handleChangeContentByType(blockData)
      ).trim();

      //reset value when change type
      handleChangeValueFieldArr(index, {
        ...blockData,
        type: type,
        content: newContent,
        todo_checked: false,
      });
      await updateBlock({
        ...blockData,
        type: type,
        content: newContent,
        height: "200",
        width: "300",
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockData, index]
  );

  return (
    <SortableItem id={blockData.id} disable={disable}>
      <Stack
        direction="row"
        minHeight="35px"
        alignItems="center"
        width="100%"
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Stack
          direction="row"
          sx={{
            opacity: "0.7",
            flex: 0,
            minHeight: "35px",
            width: "100%",
            minWidth: "10px",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {isHover ? (
            <>
              <IconButton
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  display: isLast ? "inline-flex" : "none",
                }}
                onClick={() => void handleAddBlock()}
                disabled={isLoading || disable}
                size="small"
              >
                {isLoading ? (
                  <CircularProgress
                    size="16px"
                    sx={{ color: (theme) => theme.palette.text.primary }}
                  />
                ) : (
                  <AddIcon fontSize="small" />
                )}
              </IconButton>

              <Draghandler
                handleDeleteBlock={handleDeleteBlock}
                handleChangeType={handleChangeType}
                blockData={blockData}
                isHiddenDeleteBtn={isHiddenDeleteBtn}
                disable={disable}
              />
            </>
          ) : null}
        </Stack>

        <BlockItemByType
          blockData={blockData}
          handleChangeValue={handleChangeValue}
          disable={disable}
        />
      </Stack>
    </SortableItem>
  );
};

export default memo(Block);
