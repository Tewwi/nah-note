/* eslint-disable react-hooks/exhaustive-deps */
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
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
  disable: boolean;
}

const BlockList = (props: Props) => {
  const { control, pageId, disable } = props;

  const { mutateAsync: createNewBlock, isLoading } =
    api.block.createNewBlock.useMutation();
  const { mutateAsync: deleteBlock } = api.block.deleteBlock.useMutation();
  const { mutate: updatePosition } =
    api.block.updateBlocksByPageId.useMutation();

  const { t } = useTranslation();
  const { fields, append, move, remove, update } = useFieldArray({
    control,
    name: "blocks",
    keyName: "field_id",
  });

  const handleAddNewBlock = useCallback(async () => {
    const resp = await createNewBlock({
      pageId: pageId,
      type: "text",
      content: "",
    });

    append({
      ...resp,
    });
  }, [pageId]);

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

  const handleChangeValue = useCallback((index: number, value: IBlock) => {
    update(index, value);
  }, []);

  const handleDragEnd = (e: DragEndEvent) => {
    const activeIndex = fields.findIndex((value) => value.id === e.active.id);
    const overIndex = fields.findIndex((value) => value.id === e.over?.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      move(activeIndex, overIndex);
      debounceMove(arrayMove(fields, activeIndex, overIndex));
    }
  };

  const handleDeleteBlock = useCallback(
    async (id: string) => {
      if (fields.length === 1) {
        toast.error(t("cantDelete"));
      }

      try {
        await deleteBlock({ id: id });
        const deleteBlockIndex = fields.findIndex((block) => block.id === id);
        remove(deleteBlockIndex);
        toast.success(t("deleteBlockSuccess"));
      } catch (error) {
        console.log(error);
        toast.error(error as string);
      }
    },
    [deleteBlock, fields]
  );

  return (
    <DnDContext handleDragEnd={handleDragEnd} listItems={fields}>
      {fields.map((item, index) => {
        return (
          <Block
            key={item.id}
            blockData={item}
            isLast={index === fields.length - 1}
            index={index}
            pageId={pageId}
            isLoading={isLoading}
            handleChangeValueFieldArr={handleChangeValue}
            handleAddBlock={handleAddNewBlock}
            handleDeleteBlock={handleDeleteBlock}
            disable={disable}
          />
        );
      })}
    </DnDContext>
  );
};

export default BlockList;
