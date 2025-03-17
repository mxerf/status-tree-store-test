import { describe, expect, it } from "vitest";
import { UndoRedo } from "../utils/UndoRedo";

describe("UndoRedo", () => {
  it("должен инициализироваться с пустой историей", () => {
    const undoRedo = new UndoRedo<number>();
    expect(undoRedo.historySize).toBe(0);
    expect(undoRedo.getCurrentIndex).toBe(-1);
  });

  it("должен корректно сохранять состояния", () => {
    const undoRedo = new UndoRedo<number>();
    undoRedo.saveState([1, 2, 3]);
    undoRedo.saveState([4, 5, 6]);

    expect(undoRedo.historySize).toBe(2);
    expect(undoRedo.getCurrentIndex).toBe(1);
  });

  it("должен корректно откатывать изменения (undo)", () => {
    const undoRedo = new UndoRedo<number>();
    undoRedo.saveState([1, 2, 3]);
    undoRedo.saveState([4, 5, 6]);

    const previousState = undoRedo.undo();
    expect(previousState).toEqual([1, 2, 3]);
    expect(undoRedo.getCurrentIndex).toBe(0);
  });

  it("должен возвращать null при попытке отката за пределы истории", () => {
    const undoRedo = new UndoRedo<number>();
    undoRedo.saveState([1, 2, 3]);

    undoRedo.undo();
    const outOfBoundsUndo = undoRedo.undo();
    expect(outOfBoundsUndo).toBeNull();
    expect(undoRedo.getCurrentIndex).toBe(0);
  });

  it("должен корректно повторять изменения (redo)", () => {
    const undoRedo = new UndoRedo<number>();
    undoRedo.saveState([1, 2, 3]);
    undoRedo.saveState([4, 5, 6]);

    undoRedo.undo();
    const redoneState = undoRedo.redo();
    expect(redoneState).toEqual([4, 5, 6]);
    expect(undoRedo.getCurrentIndex).toBe(1);
  });

  it("должен возвращать null при попытке повторного изменения за пределами истории", () => {
    const undoRedo = new UndoRedo<number>();
    undoRedo.saveState([1, 2, 3]);

    const outOfBoundsRedo = undoRedo.redo();
    expect(outOfBoundsRedo).toBeNull();
    expect(undoRedo.getCurrentIndex).toBe(0);
  });

  it("должен учитывать максимальный размер истории", () => {
    const undoRedo = new UndoRedo<number>(3);
    undoRedo.saveState([1]);
    undoRedo.saveState([2]);
    undoRedo.saveState([3]);
    undoRedo.saveState([4]);

    expect(undoRedo.historySize).toBe(3);
    expect(undoRedo.undo()).toEqual([3]);
  });
});
