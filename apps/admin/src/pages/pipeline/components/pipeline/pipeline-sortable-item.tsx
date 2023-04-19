import { UniqueIdentifier } from "@dnd-kit/core";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";
import { shallow } from "zustand/shallow";

import { usePipelineState } from "../../pipeline-state";
import { PipelineTreeItem, Props as TreeItemProps } from "./pipeline-tree-item";
import { iOS } from "./pipeline.utilities";

interface Props extends TreeItemProps {
  id: UniqueIdentifier;
}

export function PipelineSortableItem({ id, depth, ...props }: Props) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    transform,
    transition,
    setDraggableNodeRef,
    setDroppableNodeRef,
  } = useSortable({
    id,
    animateLayoutChanges,
  });
  const [error] = usePipelineState((state) => [state.error], shallow);

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <PipelineTreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableSelection={iOS}
      disableInteraction={isSorting}
      isError={error?.id_schema === id}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true;
