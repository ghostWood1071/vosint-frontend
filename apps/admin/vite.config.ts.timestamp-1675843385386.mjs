// vite.config.ts
import react from "file:///home/canhnt/work/v-osint3/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///home/canhnt/work/v-osint3/node_modules/vite/dist/node/index.js";
import vitePluginImp from "file:///home/canhnt/work/v-osint3/node_modules/vite-plugin-imp/dist/index.mjs";
import svgr from "file:///home/canhnt/work/v-osint3/node_modules/vite-plugin-svgr/dist/index.mjs";
var vite_config_default = defineConfig({
  resolve: {
    alias: [
      { find: /^~/, replacement: "" },
      { find: "@", replacement: "/src" }
    ]
  },
  plugins: [
    react(),
    svgr(),
    vitePluginImp({
      libList: [
        {
          libName: "lodash",
          libDirectory: "",
          camel2DashComponentName: false
        },
        {
          libName: "antd",
          style(name) {
            return `antd/es/${name}/style/index.js`;
          }
        }
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {},
        math: "always",
        javascriptEnabled: true,
        additionalData: `@import "@/assets/less/styles.less";`
      }
    },
    modules: {
      localsConvention: "camelCase"
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setup-test.ts"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9jYW5obnQvd29yay92LW9zaW50My9hcHBzL2FkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9jYW5obnQvd29yay92LW9zaW50My9hcHBzL2FkbWluL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2NhbmhudC93b3JrL3Ytb3NpbnQzL2FwcHMvYWRtaW4vdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGUvY2xpZW50XCIgLz5cbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdml0ZVBsdWdpbkltcCBmcm9tIFwidml0ZS1wbHVnaW4taW1wXCI7XG5pbXBvcnQgc3ZnciBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnclwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICAvLyB0aGlzIGFsaWFzIGlzIHVzZWQgdG8gZml4IGFudGQgbGVzcyBcImltcG9ydCBpc3N1ZVwiXG4gICAgICB7IGZpbmQ6IC9efi8sIHJlcGxhY2VtZW50OiBcIlwiIH0sXG4gICAgICB7IGZpbmQ6IFwiQFwiLCByZXBsYWNlbWVudDogXCIvc3JjXCIgfSxcbiAgICBdLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBzdmdyKCksXG4gICAgdml0ZVBsdWdpbkltcCh7XG4gICAgICBsaWJMaXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsaWJOYW1lOiBcImxvZGFzaFwiLFxuICAgICAgICAgIGxpYkRpcmVjdG9yeTogXCJcIixcbiAgICAgICAgICBjYW1lbDJEYXNoQ29tcG9uZW50TmFtZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsaWJOYW1lOiBcImFudGRcIixcbiAgICAgICAgICBzdHlsZShuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gYGFudGQvZXMvJHtuYW1lfS9zdHlsZS9pbmRleC5qc2A7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gIF0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIGxlc3M6IHtcbiAgICAgICAgbW9kaWZ5VmFyczoge30sXG4gICAgICAgIG1hdGg6IFwiYWx3YXlzXCIsXG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL2Fzc2V0cy9sZXNzL3N0eWxlcy5sZXNzXCI7YCxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBjb252ZXJ0IC5hcHAtaGVhZGVyIChsZXNzKSB0byBzdHlsZXMuYXBwSGVhZGVyICh0c3gpXG4gICAgbW9kdWxlczoge1xuICAgICAgbG9jYWxzQ29udmVudGlvbjogXCJjYW1lbENhc2VcIixcbiAgICB9LFxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogXCJqc2RvbVwiLFxuICAgIHNldHVwRmlsZXM6IFtcIi4vc3JjL3NldHVwLXRlc3QudHNcIl0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxVQUFVO0FBR2pCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUVMLEVBQUUsTUFBTSxNQUFNLGFBQWEsR0FBRztBQUFBLE1BQzlCLEVBQUUsTUFBTSxLQUFLLGFBQWEsT0FBTztBQUFBLElBQ25DO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLElBQ0wsY0FBYztBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLFNBQVM7QUFBQSxVQUNULGNBQWM7QUFBQSxVQUNkLHlCQUF5QjtBQUFBLFFBQzNCO0FBQUEsUUFDQTtBQUFBLFVBQ0UsU0FBUztBQUFBLFVBQ1QsTUFBTSxNQUFNO0FBQ1YsbUJBQU8sV0FBVztBQUFBLFVBQ3BCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixZQUFZLENBQUM7QUFBQSxRQUNiLE1BQU07QUFBQSxRQUNOLG1CQUFtQjtBQUFBLFFBQ25CLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1Asa0JBQWtCO0FBQUEsSUFDcEI7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZLENBQUMscUJBQXFCO0FBQUEsRUFDcEM7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
