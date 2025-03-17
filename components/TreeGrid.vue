<script setup lang="ts">
import type { ColDef } from "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { computed, onMounted, ref } from "vue";
import { type TreeNode } from "../types/tree-store.types";
import { TreeStore } from "../utils/TreeStore";
import { UndoRedo } from "../utils/UndoRedo";
import CellActionButtons from "./CellActionButtons.vue";
import NoRowsOverlay from "./NoRowsOverlay.vue";
import ToolbarActionButtons from "./ToolbarActionButtons.vue";

const items: TreeNode[] = [
  {
    id: 3,
    parent: "2",
    label: "Айтем 3",
  },
  { id: "2", parent: 1, label: "Айтем 2" },
  { id: 1, parent: null, label: "Айтем 1" },
];

const treeStore = new TreeStore(items);
const undoRedo = new UndoRedo<TreeNode>();

const rowData = ref(treeStore.getAll());
const isEditMode = ref(false);

const addNoParentItemHandler = () => {
  treeStore.addItem({
    id: Date.now(),
    parent: null,
    label: "Новый элемент",
  });
  rowData.value = [...treeStore.getAll()];
  saveHistory();
};

const onUndo = () => {
  const state = undoRedo.undo();
  if (state) {
    treeStore.setItems(state);
    rowData.value = [...treeStore.getAll()];
  }
};

const onRedo = () => {
  const state = undoRedo.redo();
  if (state) {
    treeStore.setItems(state);
    rowData.value = [...treeStore.getAll()];
  }
};

const saveHistory = () => {
  undoRedo.saveState(treeStore.getAll());
};

const autoGroupColumnDef = ref<ColDef<TreeNode>>({
  field: "category" as any,
  headerName: "Категория",
  minWidth: 360,
  valueGetter: (params) => {
    if (!params.data) return "";
    return treeStore.getChildren(params.data.id).length ? "Группа" : "Элемент";
  },
});

const columnDefs = computed<ColDef[]>(() => [
  {
    field: "number",
    headerName: "№ п/п",
    valueGetter: (params) => (params.node?.rowIndex ?? -1) + 1,
    width: 128,
    resizable: false,
    pinned: "left",
  },
  {
    field: "label",
    headerName: "Название",
    flex: 1,
    editable: isEditMode.value,
    minWidth: 360,
  },
  {
    headerName: "Действия",
    field: "actions",
    flex: 1,
    minWidth: 140,
    maxWidth: 140,
    cellRenderer: CellActionButtons,
    cellRendererParams: {
      isEditMode: isEditMode.value,
    },
    pinned: "right",
  },
]);

const getDataPath = (data: TreeNode) => {
  return treeStore
    .getAllParents(data.id)
    .map((p) => String(p.id))
    .concat(String(data.id));
};

const onCellClicked = (params: any) => {
  if (!isEditMode.value || !params.event.target) return;

  if (params.event.target.classList.contains("add-btn")) {
    const newItemID = Date.now();
    const newItem: TreeNode = {
      id: newItemID,
      parent: params.data.id,
      label: `Новый элемент`,
    };
    treeStore.addItem(newItem);
    rowData.value = [...treeStore.getAll()];
    saveHistory();
  }

  if (params.event.target.classList.contains("delete-btn")) {
    treeStore.removeItem(params.data.id);
    rowData.value = [...treeStore.getAll()];
    saveHistory();
  }
};

const onCellValueChanged = (params: any) => {
  if (params.colDef.field === "label") {
    treeStore.updateItem({ ...params.data, label: params.newValue });
    rowData.value = [...treeStore.getAll()];
    saveHistory();
  }
};

onMounted(() => {
  rowData.value = treeStore.getAll();
  saveHistory();
});
</script>

<template>
  <div
    style="display: flex; flex-direction: column; gap: 10px; padding: 0 2.5%"
  >
    <div class="toolbar">
      <button class="edit-mode-btn" @click="isEditMode = !isEditMode">
        Режим: {{ !isEditMode ? "просмотр" : "редактирование" }}
      </button>
      <toolbar-action-buttons
        :add-item="addNoParentItemHandler"
        :undo="onUndo"
        :redo="onRedo"
        :isEditMode="isEditMode"
        :isUndoDisabled="undoRedo.getCurrentIndex <= 0"
        :isRedoDisabled="undoRedo.getCurrentIndex >= undoRedo.historySize - 1"
      />
    </div>
    <div class="ag-theme-alpine" style="height: 720px; width: 100%">
      <ag-grid-vue
        style="height: 100%; width: 100%"
        :rowData="rowData"
        :auto-group-column-def="autoGroupColumnDef"
        :columnDefs="columnDefs"
        :treeData="true"
        :getDataPath="getDataPath"
        :groupDefaultExpanded="-1"
        :no-rows-overlay-component="NoRowsOverlay"
        :no-rows-overlay-component-params="{
          isEditMode,
          addItem: addNoParentItemHandler,
        }"
        @cellClicked="onCellClicked"
        @cellValueChanged="onCellValueChanged"
      />
    </div>
  </div>
</template>

<style>
.ag-theme-alpine {
  font-size: 14px;
}
</style>
