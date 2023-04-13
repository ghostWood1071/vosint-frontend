/// <reference types="vite/client" />
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: [
      // this alias is used to fix antd less "import issue"
      { find: /^~/, replacement: "" },
      { find: "@", replacement: "/src" },
    ],
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  build: {
    lib: {
      entry: [resolve(__dirname, "src/index.ts")],
      name: "Editor",
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        "react",
        "antd",
        "lexical",
        "@lexical/react",
        "@lexical/react/LexicalComposer",
        "@lexical/react/LexicalComposerContext",
        "@lexical/react/LexicalNestedComposer",
        "@lexical/rich-text",
      ],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
