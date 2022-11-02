import { defineConfig } from "vite";

export default defineConfig({
  base: './',
  build: {
    emptyOutDir: false,
    outDir: "dist",
    sourcemap: true,
    lib: {
      formats: ["cjs", "es"],
      entry: "./src/index.ts",
    },
  },
});
