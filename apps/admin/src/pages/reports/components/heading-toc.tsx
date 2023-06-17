import { DeleteOutlined, EditOutlined, PlusCircleFilled, PlusOutlined } from "@ant-design/icons";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  AnimateLayoutChanges,
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Popover, Space, Typography } from "antd";
import cn from "classnames";
import { CSSProperties, Dispatch, SetStateAction, forwardRef, useRef, useState } from "react";

import { useHeadingTocDispatchContext } from "./heading-toc.context";
import styles from "./heading-toc.module.less";
import { HeadingsData } from "./headings";

interface Props {
  headingsData: HeadingsData[];
  setHeadingsData: Dispatch<SetStateAction<HeadingsData[]>>;
}

export const navigationItemLevel: Record<number, string> = {
  1: styles.navigationItemLevel1,
  2: styles.navigationItemLevel2,
  3: styles.navigationItemLevel3,
  4: styles.navigationItemLevel4,
  5: styles.navigationItemLevel5,
};

export function HeadingToc({ headingsData, setHeadingsData }: Props): JSX.Element {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [selectedKey, setSelectedKey] = useState<string>("");
  const selectedIndex = useRef(0);
  const refIsOpen = useRef(null);

  const { setMode, setSelectedIndex } = useHeadingTocDispatchContext();

  function handleScrollToNode(id: string, currentIndex: number) {
    window.location.hash = id;
    setSelectedKey(id);
    selectedIndex.current = currentIndex;
  }

  const handleAdd = () => {
    setMode("create");
    setSelectedIndex(null);
  };

  function handleDragStart(event: any) {
    const { active } = event;

    setActiveId(active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setHeadingsData((headingsData) => {
        const oldIndex = headingsData.findIndex((i) => i.id === active.id);
        const newIndex = headingsData.findIndex((i) => i.id === over.id);

        return arrayMove(headingsData, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className={cn(styles.tableOfContents, "scrollbar table-of-contents")}>
      <Space align="start" className={styles.header}>
        <div className={styles.textHeader}>Mục lục</div>
        <div>
          <PlusCircleFilled onClick={handleAdd} />
        </div>
      </Space>
      <div className={styles.navigationItemList} tabIndex={0} ref={refIsOpen}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={headingsData.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {headingsData.map((heading, index) => (
              <SortableItem
                selectedKey={selectedKey}
                heading={heading}
                index={index}
                id={heading.id}
                onScroll={handleScrollToNode}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <Item clone heading={headingsData.find((i) => i.id === activeId)} id={activeId} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

function SortableItem({
  id,
  heading,
  ...props
}: {
  id: string;
  heading: HeadingsData;
  clone?: boolean;
  selectedKey: string;
  index: number;
  onScroll: (id: string, index: number) => void;
}): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting } =
    useSortable({
      id,
      animateLayoutChanges,
    });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item
      ref={setNodeRef}
      style={style}
      handleProps={{ ...attributes, ...listeners }}
      heading={heading}
      ghost={isDragging}
      disableInteraction={isSorting}
      {...props}
    />
  );
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true;

const Item = forwardRef<HTMLDivElement, any>(
  (
    { heading, style, handleProps, clone, ghost, disableInteraction, index, selectedKey, onScroll },
    ref,
  ) => {
    const { setMode, setSelectedIndex, setCurrentHeading } = useHeadingTocDispatchContext();
    const { id, level, title } = heading;

    const handleClick = (mode: "create" | "update" | "delete") => () => {
      setMode(mode);
      setCurrentHeading(level);
      setSelectedIndex(index);
    };

    return (
      <div
        key={id}
        className={cn(
          {
            [styles.navigationItem]: true,
            [styles.locationIndicatorHighlight]: selectedKey === id,
          },
          navigationItemLevel[level],
        )}
        role="navigation"
        onDoubleClick={() => onScroll(id, index)}
      >
        <Popover
          placement="right"
          content={
            <Space>
              <PlusOutlined
                onClick={handleClick("create")}
                className={styles.plus}
                title={`Thêm tiêu đề bên dưới`}
              />
              <EditOutlined
                onClick={handleClick("update")}
                className={styles.edit}
                title={`Chỉnh sửa tiêu đề`}
              />
              <DeleteOutlined
                onClick={handleClick("delete")}
                className={styles.delete}
                title={`Xóa tiêu đề`}
              />
            </Space>
          }
        >
          <div
            className={cn({
              [styles.text]: true,
              [styles.clone]: clone,
              [styles.ghost]: ghost,
              [styles.disableInteraction]: disableInteraction,
            })}
            ref={ref}
            style={style}
            {...handleProps}
          >
            <Typography.Text ellipsis>{title}</Typography.Text>
          </div>
        </Popover>
      </div>
    );
  },
);
