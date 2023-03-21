// TODO: Implement type
export function buildTree(flattenedItems: any[]) {
  const root: { _id: string; children: any[] } = { _id: "root", children: [] };
  const nodes = { [root._id]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [], key: item._id }));

  for (const item of items) {
    const { _id, children } = item;
    const parent_id = item.parent_id ?? root._id;
    const parent = nodes[parent_id] ?? findItem(items, parent_id);

    nodes[_id] = { _id, children };

    if (parent) {
      parent.children.push(item);
    } else {
      root.children.push(item);
    }
  }

  return root.children;
}

function findItem(items: any[], itemId: any) {
  return items.find(({ id }) => id === itemId);
}

export function removeItem(array: string[], item: string) {
  // Find the index of the item in the array
  let index = array.indexOf(item);
  // If the item is in the array, remove it
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

export function getAllChildIds(flatArray: any[], id: string): string[] {
  let result = [];
  let stack = [id];
  while (stack.length > 0) {
    let currentId = stack.pop();
    result.push(currentId!);
    for (let obj of flatArray) {
      if (obj.parent_id === currentId) {
        stack.push(obj._id);
      }
    }
  }
  return result;
}
