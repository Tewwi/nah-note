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
import { debounce } from "lodash";
import { useCallback } from "react";
import type { Block as IBlock } from "@prisma/client";

interface Props {
  control: Control<IPageForm>;
  pageId: string;
}

const BlockList = (props: Props) => {
  const { control, pageId } = props;

  const { mutateAsync: createNewBlock, isLoading } =
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceMove = useCallback(
    debounce((blocks: IBlock[]) => {
      updatePosition({
        pageId: pageId,
        blocks: blocks,
      });
    }, 2000),
    [pageId]
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const activeIndex = fields.findIndex((value) => value.id === e.active.id);
    const overIndex = fields.findIndex((value) => value.id === e.over?.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      move(activeIndex, overIndex);
      debounceMove(arrayMove(fields, activeIndex, overIndex));
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
      {fields.map((item, index) => {
        return (
          <Block
            handleAddBlock={handleAddNewBlock}
            blockData={item}
            key={item.id}
            pageId={pageId}
            handleDeleteBlock={handleDeleteBlock}
            isLoading={isLoading}
            isLast={index === fields.length - 1}
          />
        );
      })}
    </DnDContext>
  );
};

export default BlockList;
