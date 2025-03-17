import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  test: {
    alias: {
      "#components": "<rootDir>/components",
      "~": "<rootDir>",
    },
    globals: true,
    environment: "jsdom",
    deps: {
      inline: ["@vue/test-utils", "ag-grid-vue3"],
    },
  },
});
