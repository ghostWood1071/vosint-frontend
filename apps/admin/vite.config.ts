/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vitePluginImp from "vite-plugin-imp";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      // this alias is used to fix antd less "import issue"
      { find: /^~/, replacement: "" },
      { find: "@", replacement: "/src" },
    ],
  },
  plugins: [
    react(),
    svgr(),
    vitePluginImp({
      libList: [
        {
          libName: "lodash",
          libDirectory: "",
          camel2DashComponentName: false,
        },
        {
          libName: "antd",
          style(name) {
            return `antd/es/${name}/style/index.js`;
          },
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {},
        math: "always",
        javascriptEnabled: true,
        additionalData: `@import "@/assets/less/styles.less";`,
      },
    },
    // convert .app-header (less) to styles.appHeader (tsx)
    modules: {
      localsConvention: "camelCase",
    },
  },
  ///
  server: {
    proxy: {
      "/api": "http://vosint.aiacademy.edu.vn",
      "/api/pipeline": "http://vosint.aiacademy.edu.vn/api",
      "/api/summ": "http://vosint.aiacademy.edu.vn/api",
    }

    // proxy: {
    //   "/api": "http://testvosint3api.aiacademy.edu.vn",
    //   "/api/pipeline": "http://testvosint3api.aiacademy.edu.vn/api",
    //   "/api/summ": "http://testvosint3api.aiacademy.edu.vn/api",
    // }

    // proxy: {
    //   "/api": "http://vosint.aiacademy.edu.vn",
    //   "/api/pipeline": "http://vosint.aiacademy.edu.vn/api",
    //   "/api/summ": "http://vosint.aiacademy.edu.vn/api",
    // },

    // proxy: {
    //   '/api': {
    //     target: "http://testvosint3api.aiacademy.edu.vn",
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: path => path.replace('/api', ''),
    //   }
    // }
  },


});
