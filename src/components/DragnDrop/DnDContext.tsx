import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Stack } from "@mui/material";
import { type Block } from "@prisma/client";
import React from "react";

interface Props {
  listItems: Block[];
  handleDragEnd: (event: DragEndEvent) => void;
}

const DnDContext = (props: React.PropsWithChildren<Props>) => {
  const { listItems, children, handleDragEnd } = props;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, tolerance: { x: 0, y: 0 } },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={listItems} strategy={rectSortingStrategy}>
        <Stack direction="column" gap="8px">
          {children}
        </Stack>
      </SortableContext>
    </DndContext>
  );
};

export default DnDContext;
