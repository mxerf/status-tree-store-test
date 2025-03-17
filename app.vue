<script setup lang="ts">
import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([AllEnterpriseModule]);
</script>

<template>
  <NuxtPage />
</template>

<style>
@import "./app.css";
</style>
