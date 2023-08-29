import { IActionInfos } from "@/models/pipeline.type";
import { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";

import { FlattenedItem, TreeItem, TreeItems } from "./pipeline.type";

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
    items,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth({
  previousItem,
  items,
}: {
  previousItem: FlattenedItem;
  items: FlattenedItem[];
}) {
  if (previousItem?.is_ctrl_flow) {
    return previousItem.depth + 1;
  }

  if (previousItem?.parentId && findItem(items, previousItem.parentId)?.is_ctrl_flow) {
    return previousItem.depth;
  }

  return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

function flatten(
  items: TreeItems,
  parentId: UniqueIdentifier | null = null,
  depth = 0,
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...(Array.isArray(item.params.actions) && item.params.actions.length > 0
        ? flatten(item.params.actions, item.id, depth + 1)
        : []),
    ];
  }, []);
}

export function flattenTree(items: TreeItems, actions: IActionInfos[]) {
  const flattenedItems = flatten(items);
  return addActionToPipeline(flattenedItems, actions);
}

export function addActionToPipeline(
  pipeline: FlattenedItem[],
  actions: IActionInfos[],
): FlattenedItem[] {
  return pipeline.map((pipeline) => {
    const actionIndex = actions.findIndex(({ name }) => pipeline.name === name);
    if (actionIndex === -1) return pipeline;
    const { display_name, is_ctrl_flow, param_infos, readme } = actions[actionIndex];
    return {
      ...pipeline,
      display_name,
      is_ctrl_flow,
      param_infos,
      readme,
    };
  });
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  const root: TreeItem = { id: "root", name: "root", params: { actions: [] } };
  const nodes = { [root.id]: root };
  const items = flattenedItems.map((item) => ({
    ...item,
    params: { ...item.params, actions: [] as TreeItems },
  }));

  for (const item of items) {
    const {
      id,
      name,
      params: { actions },
    } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);
    nodes[id] = { id, name, params: { actions: actions } };
    Array.isArray(parent.params.actions) && parent.params.actions.push(item);
  }

  return root.params.actions as TreeItems;
}

export function findItem(items: TreeItems, itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId);
}

export function findItemDeep(items: TreeItems, itemId: UniqueIdentifier): TreeItem | undefined {
  for (const item of items) {
    const {
      id,
      params: { actions },
    } = item;
    if (id === itemId) return item;
    if (Array.isArray(actions)) {
      const child = findItemDeep(actions, itemId);
      if (child) {
        return child;
      }
    }
  }
  return undefined;
}

export function removeItem(items: TreeItems, id: UniqueIdentifier) {
  const newItems = [];

  for (const item of items) {
    if (item.id === id) {
      continue;
    }

    if (Array.isArray(item.params.actions) && item.params.actions.length) {
      item.params.actions = removeItem(item.params.actions, id);
    }

    newItems.push(item);
  }

  return newItems;
}

export function setProperty<T extends keyof TreeItem>(
  items: TreeItems,
  id: UniqueIdentifier,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T],
) {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property]);
      continue;
    }

    if (Array.isArray(item.params.actions) && item.params.actions.length) {
      item.params.actions = setProperty(item.params.actions, id, property, setter);
    }
  }

  return [...items];
}

export function countChildren(items: TreeItem[], count = 0): number {
  return items?.reduce((acc, { params: { actions } }) => {
    if (Array.isArray(actions) && actions.length) {
      return countChildren(actions, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount(items: TreeItems, id: UniqueIdentifier) {
  const item = findItemDeep(items, id);

  return item && Array.isArray(item.params.actions) ? countChildren(item.params.actions) : 0;
}

export function removeChildrenOf(items: FlattenedItem[], ids: UniqueIdentifier[]) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item?.params?.actions?.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}

export function generateIdToActions(actions: IActionInfos[]) {
  return actions.map((action) => ({ ...action, id: nanoid() }));
}
