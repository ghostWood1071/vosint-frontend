import { ActionLogIcon } from "@/assets/svg";
import { VI_LOCALE } from "@/locales/cron";
import { IActionInfos, IPipelineSchema } from "@/services/pipeline.type";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
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
import { Button, Card, Col, Row, Space, Typography } from "antd";
import produce from "immer";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Cron } from "react-js-cron";
import "react-js-cron/dist/styles.css";

import { PipelineAction } from "./pipeline-action";
import { PipelineSortableItem } from "./pipeline-sortable-item";
import { PipelineTreeOptions } from "./pipeline-tree-options";
import "./pipeline.less";
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

const { Paragraph } = Typography;

interface Props {
  initialItems: IPipelineSchema[];
  initialActions: IActionInfos[];
  initialNamePipeline?: string;
  initialCron: string;
  onSavePipeline?: (args: { pipeline: IPipelineSchema[]; name: string; cron_expr: string }) => void;
  onVerifyPipeline?: () => void;
}

const indentationWidth = 40;

export function Pipeline({
  initialItems,
  initialActions,
  initialNamePipeline,
  initialCron,
  onSavePipeline,
  onVerifyPipeline,
}: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });
  const [items, setItems] = useState(() => initialItems);
  const [actions, setActions] = useState(() => initialActions);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [optionId, setOptionId] = useState<UniqueIdentifier | null>(null);
  const [clonedItems, setClonedItem] = useState<IPipelineSchema[] | null>(null);
  const [pipelineName, setPipelineName] = useState<string>(
    initialNamePipeline ?? t("name_pipeline"),
  );
  const [cron, setCron] = useState(initialCron);

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
      <Row className="pipeline">
        <Col span={5}>
          <Card title="Action" className="pipeline-actions">
            {actions.map(({ id, name, display_name, readme }) => (
              <PipelineAction
                key={id}
                id={id}
                display_name={display_name}
                name={name}
                readme={readme}
              />
            ))}
          </Card>
        </Col>
        <Col span={18} offset={1}>
          <Card
            className="pipeline-dnd"
            title={
              <Paragraph
                editable={{
                  icon: <EditOutlined />,
                  tooltip: t("edit_pipeline_name"),
                  onChange: setPipelineName,
                  triggerType: ["text", "icon"],
                  enterIcon: null,
                }}
              >
                {pipelineName}
              </Paragraph>
            }
            extra={
              <Space>
                {onSavePipeline && (
                  <Button icon={<SaveOutlined />} title="Save" onClick={handleSavePipeline} />
                )}
                {onVerifyPipeline && (
                  <Button
                    icon={<ActionLogIcon />}
                    title="verify pipeline"
                    onClick={handleVerifyPipeline}
                  />
                )}
              </Space>
            }
          >
            <Row gutter={8}>
              <Col span={optionId ? 12 : 16} offset={optionId ? 2 : 4}>
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
              </Col>
              {optionId && optionItem && (
                <Col span={8} offset={2}>
                  <PipelineTreeOptions
                    onClose={() => setOptionId(null)}
                    option={optionItem}
                    onValuesChange={handleOptionFormValueChange}
                  />
                </Col>
              )}
            </Row>
          </Card>
          <Card title="Lịch chạy" className="pipeline-cron">
            <Cron value={cron} setValue={setCron} locale={VI_LOCALE} />
          </Card>
        </Col>
      </Row>
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

  function handleSavePipeline() {
    onSavePipeline?.({ name: pipelineName, pipeline: items, cron_expr: cron });
  }

  function handleVerifyPipeline() {
    onVerifyPipeline?.();
  }

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
      produce((draft) => {
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
    setItems((items) => {
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
    optionId && setItems((items) => setProperty(items, optionId, "params", () => values));
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
