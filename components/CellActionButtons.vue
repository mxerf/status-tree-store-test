<script setup lang="ts">
import { defineProps } from "vue";

const { params } = defineProps<{
  params: {
    isEditMode: boolean;
  };
}>();
</script>

<template>
  <div class="action-buttons-cell">
    <button :disabled="!params.isEditMode" class="action-button add-btn">
      +
    </button>
    <button :disabled="!params.isEditMode" class="action-button delete-btn">
      x
    </button>
  </div>
</template>
