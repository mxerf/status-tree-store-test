import { beforeEach, describe, expect, it } from "vitest";
import type { TreeNode } from "../types/tree-store.types";
import { TreeStore } from "../utils/TreeStore";

describe("TreeStore", () => {
  let store: TreeStore;
  let initialData: TreeNode[];

  beforeEach(() => {
    initialData = [
      { id: 1, parent: null, label: "Root" },
      { id: 2, parent: 1, label: "Child 1" },
      { id: 3, parent: 1, label: "Child 2" },
      { id: 4, parent: 2, label: "Grandchild 1" },
    ];
    store = new TreeStore(initialData);
  });

  it("инициализируется корректно", () => {
    expect(store.getAll()).toHaveLength(4);
  });

  it("получает элемент по ID", () => {
    expect(store.getItem(2)).toEqual({ id: 2, parent: 1, label: "Child 1" });
  });

  it("возвращает `undefined`, если элемент не найден", () => {
    expect(store.getItem(999)).toBeUndefined();
  });

  it("возвращает детей элемента", () => {
    expect(store.getChildren(1)).toEqual([
      { id: 2, parent: 1, label: "Child 1" },
      { id: 3, parent: 1, label: "Child 2" },
    ]);
  });

  it("возвращает всех детей рекурсивно", () => {
    expect(store.getAllChildren(1).map((n) => n.id)).toEqual([2, 4, 3]);
  });

  it("возвращает всех родителей элемента", () => {
    expect(store.getAllParents(4).map((n) => n.id)).toEqual([1, 2]);
  });

  it("добавляет элемент", () => {
    store.addItem({ id: 5, parent: 2, label: "New Child" });
    expect(store.getItem(5)).toEqual({ id: 5, parent: 2, label: "New Child" });
    expect(store.getChildren(2).length).toBe(2);
  });

  it("выдает ошибку при добавлении дубликата", () => {
    expect(() =>
      store.addItem({ id: 1, parent: null, label: "Duplicate" })
    ).toThrow();
  });

  it("удаляет элемент и всех его потомков", () => {
    store.removeItem(2);
    expect(store.getItem(2)).toBeUndefined();
    expect(store.getItem(4)).toBeUndefined();
  });

  it("обновляет элемент", () => {
    store.updateItem({ id: 2, parent: 1, label: "Updated Child 1" });
    expect(store.getItem(2)?.label).toBe("Updated Child 1");
  });

  it("выдает ошибку при обновлении несуществующего элемента", () => {
    expect(() =>
      store.updateItem({ id: 999, parent: null, label: "Not Found" })
    ).toThrow();
  });
});
