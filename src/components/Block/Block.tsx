import AddIcon from "@mui/icons-material/Add";
import { IconButton, Stack } from "@mui/material";
import { Block } from "@prisma/client";
import { api } from "~/utils/api";
import TinyEditor from "../Editor/TinyEditor";
import { SortableItem } from "./BlockDnDProcider";
import Draghandler from "./Draghandler";

interface Props {
  pageId: string;
  blockData: Block;
  handleAddBlock: () => Promise<void>;
  handleDeleteBlock: (id: string) => Promise<void>;
}

const Block = (props: Props) => {
  const { handleAddBlock, blockData, handleDeleteBlock } = props;
  const { mutateAsync: updateBlock } = api.block.updateBlock.useMutation();

  const handleChangeValue = async (value: string) => {
    await updateBlock({ ...blockData, content: value });
  };

  return (
    <SortableItem id={blockData.id}>
      <Stack
        direction="row"
        sx={{ opacity: "0.7", flex: 0, minHeight: "35px", width: "100%" }}
      >
        <IconButton
          sx={{ color: (theme) => theme.palette.text.primary }}
          onClick={() => void handleAddBlock()}
        >
          <AddIcon fontSize="small" />
        </IconButton>

        <Draghandler
          handleDeleteBlock={() => void handleDeleteBlock(blockData.id)}
        />
      </Stack>

      <TinyEditor
        value={blockData.content}
        handleChangeValue={handleChangeValue}
      />
    </SortableItem>
  );
};

export default Block;
