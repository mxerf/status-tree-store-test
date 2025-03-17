export class UndoRedo<T> {
  private history: T[][];
  private currentIndex: number;
  private maxHistorySize: number;

  constructor(maxHistorySize: number = 30) {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistorySize = maxHistorySize;
  }

  saveState(state: T[]) {
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push([...state]);
    this.currentIndex++;
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  get getCurrentIndex() {
    return this.currentIndex;
  }

  get historySize() {
    return this.history.length;
  }
}
