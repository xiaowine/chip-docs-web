import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
export default defineConfig({
    base: process.env.NODE_ENV === "production" ? "./" : "/",
    plugins: [vue()],
    root: "web",
    publicDir: resolve(__dirname, "web/public"),
    resolve: {
        alias: {
            "@": resolve(__dirname, "wine-ui"),
            "@components": resolve(__dirname, "wine-ui/components"),
            "@web": resolve(__dirname, "web"),
            "wine-ui": resolve(__dirname, "wine-ui"),
            "@theme": resolve(__dirname, "wine-ui/styles"),
        },
    },
    build: {
        outDir: resolve(__dirname, "dist"),
        assetsDir: "assets",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "web/index.html"),
            },
            output: {
                assetFileNames: "assets/[name].[hash][extname]", // 自定义静态资源输出名
                chunkFileNames: "assets/[name].[hash].js", // 自定义 chunk 输出名
                entryFileNames: "assets/[name].[hash].js", // 自定义入口文件输出名
            },
        },
    },
    preview: {
        port: 5000,
        strictPort: true,
        host: true,
    },
});
