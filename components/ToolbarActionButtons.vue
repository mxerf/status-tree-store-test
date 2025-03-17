<script setup lang="ts">
import { defineProps } from "vue";

const { addItem, undo, redo, isEditMode, isUndoDisabled, isRedoDisabled } =
  defineProps<{
    addItem: () => void;
    undo: () => void;
    redo: () => void;
    isEditMode: boolean;
    isUndoDisabled: boolean;
    isRedoDisabled: boolean;
  }>();
</script>

<template>
  <div class="toolbar-undo-redo">
    <button
      class="undo-redo-btn"
      v-if="isEditMode"
      @click="addItem"
      :disabled="!isEditMode"
    >
      +
    </button>
    <button
      class="undo-redo-btn"
      v-if="isEditMode"
      @click="undo"
      :disabled="isUndoDisabled"
    >
      ↩
    </button>
    <button
      class="undo-redo-btn"
      v-if="isEditMode"
      @click="redo"
      :disabled="isRedoDisabled"
    >
      ↪
    </button>
  </div>
</template>
