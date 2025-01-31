import { IActionInfos, IPipelineSchema } from "@/models/pipeline.type";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  Modifier,
  UniqueIdentifier,
  closestCenter,
  defaultDropAnimation,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Alert, Card, Col, Row } from "antd";
import produce from "immer";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "react-js-cron/dist/styles.css";
import { shallow } from "zustand/shallow";

import { usePipelineState } from "../../pipeline-state";
import { PipelineAction } from "./pipeline-action";
import { PipelineSortableItem } from "./pipeline-sortable-item";
import { PipelineTreeOptions } from "./pipeline-tree-options";
import styles from "./pipeline.module.less";
import { FlattenedItem } from "./pipeline.type";
import {
  buildTree,
  flattenTree,
  getChildCount,
  getProjection,
  removeChildrenOf,
  removeItem,
  setProperty,
} from "./pipeline.utilities";

interface Props {
  items: IPipelineSchema[];
  initialActions: IActionInfos[];
  setItems?: any;
}

const indentationWidth = 40;

export function Pipeline({ items, initialActions, setItems }: Props) {
  const [actions, setActions] = useState(() => initialActions);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [optionId, setOptionId] = useState<UniqueIdentifier | null>(null);
  const [clonedItems, setClonedItem] = useState<IPipelineSchema[] | null>(null);
  const [error] = usePipelineState((state) => [state.error], shallow);
  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items, actions);
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { params: { actions }, collapsed, id }) =>
        collapsed && actions.length ? [...acc, id] : acc,
      [],
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    );
  }, [actions, activeId, items]);

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;
  const optionItem = optionId ? flattenedItems.find(({ id }) => id === optionId) : null;

  const projected =
    activeId && sortedIds.includes(activeId) && overId
      ? getProjection(flattenedItems, activeId, overId, offsetLeft, indentationWidth)
      : null;
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onDragCancel={handleDragCancel}
    >
      <div className={styles.bodyBox}>
        <div className={styles.body}>
          <div className={styles.leftBody}>
            {actions.map(({ id, name, display_name, readme }) => (
              <PipelineAction
                key={id}
                id={id}
                display_name={display_name}
                name={name}
                readme={readme}
              />
            ))}
          </div>
          <div className={styles.rightBody}>
            <div className={styles.pipelineContainer}>
              <div
                className={
                  optionId && optionItem ? styles.pipelineBodyWithOption : styles.pipelineBody
                }
              >
                <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
                  {flattenedItems.map(
                    ({
                      id,
                      depth,
                      collapsed,
                      params,
                      display_name,
                      readme,
                      name,
                      is_ctrl_flow,
                    }) => (
                      <PipelineSortableItem
                        key={id}
                        id={id}
                        depth={id === activeId && projected ? projected.depth : depth}
                        indentationWidth={indentationWidth}
                        display_name={display_name}
                        name={name}
                        readme={readme}
                        is_ctrl_flow={is_ctrl_flow}
                        isOpenOptions={optionId === id}
                        collapsed={
                          !!(collapsed && Array.isArray(params.actions) && params.actions.length)
                        }
                        onCollapse={
                          Array.isArray(params.actions) && params.actions.length
                            ? () => handleCollapse(id)
                            : undefined
                        }
                        onRemove={() => handleRemove(id)}
                        onOpenOptions={() => setOptionId(id)}
                      />
                    ),
                  )}
                </SortableContext>
              </div>
            </div>
            {optionId && optionItem && (
              <div className={styles.optionContainer}>
                {error && (
                  <Alert
                    type="error"
                    message={error.actione}
                    description={error.message_error}
                    className={styles.pipelineAlert}
                  />
                )}
                <PipelineTreeOptions
                  onClose={() => setOptionId(null)}
                  option={optionItem}
                  onValuesChange={handleOptionFormValueChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {createPortal(
        <DragOverlay
          dropAnimation={dropAnimationConfig}
          modifiers={[adjustTranslate]}
          zIndex={1000}
        >
          {activeId && activeItem ? (
            <PipelineSortableItem
              id={activeId}
              depth={activeItem.depth}
              name={activeItem.name}
              clone
              childCount={getChildCount(items, activeId) + 1}
              indentationWidth={indentationWidth}
              display_name={activeItem.display_name}
              readme={activeItem.readme}
            />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);
    setClonedItem(items);
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over, active }: DragOverEvent) {
    if (sortedIds.includes(active.id)) {
      setOverId(over?.id ?? null);
      return;
    }

    setItems(
      produce((draft: any) => {
        draft.push({
          id: active.id,
          name: active!.data!.current!.name,
          params: {},
        });
      }),
    );
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(items, actions)));
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };
      const defaultParams = activeTreeItem?.param_infos?.reduce(
        (acc, curr) => ({ ...acc, [curr.name]: curr.default_val }),
        {},
      );
      clonedItems[activeIndex].params = { ...defaultParams, ...activeTreeItem.params };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);
      setItems(newItems);
      resetActionId(active.id);
    }
  }

  function handleDragCancel() {
    if (clonedItems) {
      setItems(clonedItems);
    }
    resetActionId(activeId!);
    setClonedItem(null);
    resetState();
  }

  function handleCollapse(id: UniqueIdentifier) {
    setItems(setProperty(items, id, "collapsed", (value) => !value));
  }

  function handleRemove(id: UniqueIdentifier) {
    setItems((items: any) => {
      const newItems = removeItem(items, id);
      if (newItems.length === 0) {
        return [{ id: "goto", name: "goto", params: {} }];
      }
      return newItems;
    });
  }

  function resetState() {
    setActiveId(null);
    setOverId(null);
    setOffsetLeft(0);
  }

  function resetActionId(id: UniqueIdentifier) {
    setActions(
      produce((draft) => {
        const actionIndex = draft!.findIndex((action) => action.id === id);
        if (actionIndex === -1) return;
        draft![actionIndex!].id = nanoid();
      }),
    );
  }

  function handleOptionFormValueChange(_changedValues: any, values: Record<string, any>) {
    optionId && setItems((items: any) => setProperty(items, optionId, "params", () => values));
  }
}

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: "ease-out",
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    x: transform.x - 10,
    y: transform.y - 5,
  };
};
