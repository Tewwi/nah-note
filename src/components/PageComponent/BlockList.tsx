import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { TRPCErrorResponse } from "@trpc/server/rpc";
import { useFieldArray, type Control } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { IPageForm } from "~/interface/IPage";
import { api } from "~/utils/api";
import Block from "../Block/Block";
import DnDContext from "../DragnDrop/DnDContext";
// import { arrayMove } from "@dnd-kit/sortable";

interface Props {
  control: Control<IPageForm>;
  pageId: string;
}

const BlockList = (props: Props) => {
  const { control, pageId } = props;

  const { mutateAsync: createNewBlock } =
    api.block.createNewBlock.useMutation();
  const { mutateAsync: deleteBlock } = api.block.deleteBlock.useMutation();
  const { mutate: updatePosition } =
    api.block.updateBlocksByPageId.useMutation();

  const { t } = useTranslation();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "blocks",
    keyName: "field_id",
  });

  const handleAddNewBlock = async () => {
    const resp = await createNewBlock({
      pageId: pageId,
      type: "text",
      content: "",
    });

    append({
      ...resp,
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const activeIndex = fields.findIndex((value) => value.id === e.active.id);
    const overIndex = fields.findIndex((value) => value.id === e.over?.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      move(activeIndex, overIndex);
      updatePosition({
        pageId: pageId,
        blocks: arrayMove(fields, activeIndex, overIndex),
      });
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      await deleteBlock({ id: id });
      const deleteBlockIndex = fields.findIndex((block) => block.id === id);
      remove(deleteBlockIndex);
      toast.success(t("deleteBlockSuccess"));
    } catch (error) {
      const err = error as TRPCErrorResponse;
      toast.error(err.error.message);
    }
  };

  return (
    <DnDContext handleDragEnd={handleDragEnd} listItems={fields}>
      {fields.map((item) => {
        return (
          <Block
            handleAddBlock={handleAddNewBlock}
            blockData={item}
            key={item.id}
            pageId={pageId}
            handleDeleteBlock={handleDeleteBlock}
          />
        );
      })}
    </DnDContext>
  );
};

export default BlockList;
