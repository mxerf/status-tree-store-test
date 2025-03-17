import type { TreeNode } from "~/types/tree-store.types";

// feat: init TreeStore and get- methods implementation
export class TreeStore {
  private items: TreeNode[];
  private itemMap: Map<number | string, TreeNode>;
  private childrenMap: Map<number | string, TreeNode[]>;

  constructor(items: TreeNode[]) {
    this.items = items;
    this.itemMap = new Map();
    this.childrenMap = new Map();

    this.buildTree();
  }

  private buildTree() {
    for (const item of this.items) {
      this.itemMap.set(item.id, item);

      const parentKey = item.parent ?? "root";
      if (!this.childrenMap.has(parentKey)) {
        this.childrenMap.set(parentKey, []);
      }
      this.childrenMap.get(parentKey)?.push(item);
    }
  }

  setItems(items: TreeNode[]) {
    this.items = items;
    this.buildTree();
  }

  getAll(): TreeNode[] {
    return this.items;
  }

  getItem(id: number | string): TreeNode | undefined {
    return this.itemMap.get(id);
  }

  getChildren(id: number | string): TreeNode[] {
    return this.childrenMap.get(id) || [];
  }

  getAllChildren(id: number | string): TreeNode[] {
    const result: TreeNode[] = [];
    const stack: TreeNode[] = this.getChildren(id);

    while (stack.length > 0) {
      const node = stack.shift()!;
      result.push(node);
      stack.unshift(...this.getChildren(node.id));
    }
    return result;
  }

  getAllParents(id: number | string): TreeNode[] {
    const result: TreeNode[] = [];
    const initial = this.getItem(id);
    if (!initial) throw Error(`Item with id ${id} not found.`);
    let current = this.getItem(id);

    while (current && current.parent !== null) {
      current = this.getItem(current.parent);
      if (current) result.push(current);
    }

    return result.reverse();
  }

  // feat: implement addItem, removeItem, and updateItem methods in TreeStore
  addItem(item: TreeNode): void {
    if (this.itemMap.has(item.id)) {
      throw new Error(`Item with id ${item.id} already exists.`);
    }

    this.itemMap.set(item.id, item);
    this.items.push(item);

    const parentKey = item.parent ?? "root";
    if (!this.childrenMap.has(parentKey)) {
      this.childrenMap.set(parentKey, []);
    }
    this.childrenMap.get(parentKey)?.push(item);
  }

  removeItem(id: number | string): void {
    const toRemove = new Set([
      id,
      ...this.getAllChildren(id).map((item) => item.id),
    ]);

    this.items = this.items.filter((item) => !toRemove.has(item.id));
    this.itemMap = new Map(this.items.map((item) => [item.id, item]));

    for (const parentKey of this.childrenMap.keys()) {
      this.childrenMap.set(
        parentKey,
        this.childrenMap
          .get(parentKey)
          ?.filter((item) => !toRemove.has(item.id)) || []
      );
    }
  }

  updateItem(updatedItem: TreeNode): void {
    if (!this.itemMap.has(updatedItem.id)) {
      throw new Error(`Item with id ${updatedItem.id} not found.`);
    }

    const index = this.items.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) this.items[index] = updatedItem;

    this.itemMap.set(updatedItem.id, updatedItem);
  }
}
