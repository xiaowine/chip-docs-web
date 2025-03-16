import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "wine-ui"),
      "@theme": resolve(__dirname, "wine-ui/styles"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "wine-ui/index.ts"),
      name: "WineUI",
      fileName: (format) => `wine-ui.${format}.js`,
    },
    outDir: "dist-lib",
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        exports: "named",
      },
    },
    cssCodeSplit: true,
  },
});
