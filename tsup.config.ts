import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      "vanilla/index": "src/vanilla/index.ts",
      "react/index": "src/react/index.ts",
      "vue/index": "src/vue/index.ts",
      "svelte/index": "src/svelte/index.ts"
    },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2020",
    splitting: false,
    treeshake: true,
    external: ["react", "vue", "svelte/store"]
  },
  {
    entry: {
      "browser/debounce": "src/browser/global.ts"
    },
    format: ["iife"],
    globalName: "Debounce",
    minify: false,
    sourcemap: true,
    clean: false,
    target: "es2020"
  }
]);
