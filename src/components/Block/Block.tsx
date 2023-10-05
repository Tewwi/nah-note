import AddIcon from "@mui/icons-material/Add";
import { CircularProgress, IconButton, Stack } from "@mui/material";
import { Block } from "@prisma/client";
import { api } from "~/utils/api";
import TinyEditor from "../Editor/TinyEditor";
import { SortableItem } from "./BlockDnDProvider";
import Draghandler from "./Draghandler";
import { useCallback, useState } from "react";

interface Props {
  pageId: string;
  blockData: Block;
  handleAddBlock: () => Promise<void>;
  handleDeleteBlock: (id: string) => Promise<void>;
  isLoading: boolean;
  isLast: boolean;
}

const Block = (props: Props) => {
  const { handleAddBlock, blockData, handleDeleteBlock, isLoading, isLast } =
    props;
  const { mutateAsync: updateBlock } = api.block.updateBlock.useMutation();
  const [isHover, setIsHover] = useState(false);

  const handleChangeValue = useCallback(
    async (value: string) => {
      await updateBlock({ ...blockData, content: value });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockData]
  );

  return (
    <SortableItem id={blockData.id}>
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
                disabled={isLoading}
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
                handleDeleteBlock={() => void handleDeleteBlock(blockData.id)}
              />
            </>
          ) : null}
        </Stack>

        <TinyEditor
          value={blockData.content}
          handleChangeValue={handleChangeValue}
        />
      </Stack>
    </SortableItem>
  );
};

export default Block;
