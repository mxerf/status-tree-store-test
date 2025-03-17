<script setup lang="ts">
import { defineProps } from "vue";

const { params } = defineProps<{
  params: {
    addItem: () => void;
    isEditMode: boolean;
  };
}>();
</script>

<template>
  <div class="no-rows-overlay">
    <button
      class="no-rows-overlay-button"
      @click="params.addItem"
      :disabled="!params.isEditMode"
    >
      Add row
    </button>
  </div>
</template>
