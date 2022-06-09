// vite.config.ts
import { defineConfig, searchForWorkspaceRoot } from "vite";
import RubyPlugin from "vite-plugin-ruby";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { join } from "node:path/posix";
import swc from "unplugin-swc";
import { visualizer } from "rollup-plugin-visualizer";
var vite_config_default = defineConfig({
  plugins: [
    RubyPlugin(),
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy"]
        }
      }
    }),
    VitePWA({
      injectRegister: "script",
      manifest: {
        name: "Brickdoc",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{woff,woff2,ttf,js,svg,mp4,jpg,png,webp,webm,mov}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/s3\.brickdoc\.com\/npmjs\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "brickdoc-npmjs-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/s3\.brickdoc\.com\/webfonts\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "brickdoc-webfonts-cache",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    }),
    swc.vite(),
    process.env.BUNDLE_STATS ? visualizer({
      brotliSize: true,
      filename: "./tmp/esm-bundle-stats.html"
    }) : void 0
  ],
  build: {
    chunkSizeWarningLimit: 1024,
    sourcemap: true,
    cssCodeSplit: false,
    target: ["chrome74", "ios13", "safari13"],
    rollupOptions: {
      output: {
        manualChunks: {
          common: ["react", "react-dom", "@brickdoc/active-support", "i18next", "@apollo/client", "yup"],
          telemetry: ["@sentry/react", "@sentry/tracing", "@sentry/integrations"],
          "design-system": ["@brickdoc/design-system", "@brickdoc/design-icons", "framer-motion"]
        }
      }
    }
  },
  optimizeDeps: {
    include: ["dayjs", "yup", "lodash-es", "framer-motion", "yup"]
  },
  resolve: {
    alias: {
      lodash: "lodash-es",
      plugins: join("/Users/ding/Projects/brickdoc/apps/server-monolith", "../../plugins")
    },
    dedupe: ["react", "react-dom", "i18next", "react-i18next"]
  },
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(join(process.cwd(), "..", ".."))
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogVE9ETzogZGVsZXRlIG1lIGFmdGVyIHJhaWxzIHByb2plY3QgcmV0aXJlZFxuICovXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHNlYXJjaEZvcldvcmtzcGFjZVJvb3QgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFJ1YnlQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tcnVieSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAnbm9kZTpwYXRoL3Bvc2l4J1xuaW1wb3J0IHN3YyBmcm9tICd1bnBsdWdpbi1zd2MnXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWRlZmF1bHQtZXhwb3J0XG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgUnVieVBsdWdpbigpLFxuICAgIHJlYWN0KHtcbiAgICAgIGJhYmVsOiB7XG4gICAgICAgIHBhcnNlck9wdHM6IHtcbiAgICAgICAgICBwbHVnaW5zOiBbJ2RlY29yYXRvcnMtbGVnYWN5J11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgaW5qZWN0UmVnaXN0ZXI6ICdzY3JpcHQnLFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ0JyaWNrZG9jJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvcHdhLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL3B3YS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLnt3b2ZmLHdvZmYyLHR0ZixqcyxzdmcsbXA0LGpwZyxwbmcsd2VicCx3ZWJtLG1vdn0nXSxcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL3MzXFwuYnJpY2tkb2NcXC5jb21cXC9ucG1qc1xcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2JyaWNrZG9jLW5wbWpzLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwMCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9zM1xcLmJyaWNrZG9jXFwuY29tXFwvd2ViZm9udHNcXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdicmlja2RvYy13ZWJmb250cy1jYWNoZScsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAzMCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pLFxuICAgIHN3Yy52aXRlKCksXG4gICAgcHJvY2Vzcy5lbnYuQlVORExFX1NUQVRTXG4gICAgICA/IHZpc3VhbGl6ZXIoe1xuICAgICAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgICAgICAgZmlsZW5hbWU6ICcuL3RtcC9lc20tYnVuZGxlLXN0YXRzLmh0bWwnXG4gICAgICAgIH0pXG4gICAgICA6IHVuZGVmaW5lZFxuICBdLFxuICBidWlsZDoge1xuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAyNCxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgICB0YXJnZXQ6IFsnY2hyb21lNzQnLCAnaW9zMTMnLCAnc2FmYXJpMTMnXSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgY29tbW9uOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdAYnJpY2tkb2MvYWN0aXZlLXN1cHBvcnQnLCAnaTE4bmV4dCcsICdAYXBvbGxvL2NsaWVudCcsICd5dXAnXSxcbiAgICAgICAgICB0ZWxlbWV0cnk6IFsnQHNlbnRyeS9yZWFjdCcsICdAc2VudHJ5L3RyYWNpbmcnLCAnQHNlbnRyeS9pbnRlZ3JhdGlvbnMnXSxcbiAgICAgICAgICAnZGVzaWduLXN5c3RlbSc6IFsnQGJyaWNrZG9jL2Rlc2lnbi1zeXN0ZW0nLCAnQGJyaWNrZG9jL2Rlc2lnbi1pY29ucycsICdmcmFtZXItbW90aW9uJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydkYXlqcycsICd5dXAnLCAnbG9kYXNoLWVzJywgJ2ZyYW1lci1tb3Rpb24nLCAneXVwJ11cbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBsb2Rhc2g6ICdsb2Rhc2gtZXMnLFxuICAgICAgcGx1Z2luczogam9pbihcIi9Vc2Vycy9kaW5nL1Byb2plY3RzL2JyaWNrZG9jL2FwcHMvc2VydmVyLW1vbm9saXRoXCIsICcuLi8uLi9wbHVnaW5zJylcbiAgICB9LFxuICAgIGRlZHVwZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAnaTE4bmV4dCcsICdyZWFjdC1pMThuZXh0J11cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgZnM6IHtcbiAgICAgIGFsbG93OiBbXG4gICAgICAgIC8vIERlZmluZSBjb3JyZWN0IHBhdGggZm9yIG1vbm9yZXBvXG4gICAgICAgIHNlYXJjaEZvcldvcmtzcGFjZVJvb3Qoam9pbihwcm9jZXNzLmN3ZCgpLCAnLi4nLCAnLi4nKSlcbiAgICAgIF1cbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxXQUFXO0FBQUEsSUFDWCxNQUFNO0FBQUEsTUFDSixPQUFPO0FBQUEsUUFDTCxZQUFZO0FBQUEsVUFDVixTQUFTLENBQUMsbUJBQW1CO0FBQUEsUUFDL0I7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixnQkFBZ0I7QUFBQSxNQUNoQixVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxjQUFjLENBQUMsd0RBQXdEO0FBQUEsUUFDdkUsZ0JBQWdCO0FBQUEsVUFDZDtBQUFBLFlBQ0UsWUFBWTtBQUFBLFlBQ1osU0FBUztBQUFBLFlBQ1QsU0FBUztBQUFBLGNBQ1AsV0FBVztBQUFBLGNBQ1gsWUFBWTtBQUFBLGdCQUNWLFlBQVk7QUFBQSxnQkFDWixlQUFlLEtBQUssS0FBSyxLQUFLO0FBQUEsY0FDaEM7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxjQUNQLFdBQVc7QUFBQSxjQUNYLFlBQVk7QUFBQSxnQkFDVixZQUFZO0FBQUEsZ0JBQ1osZUFBZSxLQUFLLEtBQUssS0FBSztBQUFBLGNBQ2hDO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsSUFBSSxLQUFLO0FBQUEsSUFDVCxRQUFRLElBQUksZUFDUixXQUFXO0FBQUEsTUFDVCxZQUFZO0FBQUEsTUFDWixVQUFVO0FBQUEsSUFDWixDQUFDLElBQ0Q7QUFBQSxFQUNOO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCx1QkFBdUI7QUFBQSxJQUN2QixXQUFXO0FBQUEsSUFDWCxjQUFjO0FBQUEsSUFDZCxRQUFRLENBQUMsWUFBWSxTQUFTLFVBQVU7QUFBQSxJQUN4QyxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxhQUFhLDRCQUE0QixXQUFXLGtCQUFrQixLQUFLO0FBQUEsVUFDN0YsV0FBVyxDQUFDLGlCQUFpQixtQkFBbUIsc0JBQXNCO0FBQUEsVUFDdEUsaUJBQWlCLENBQUMsMkJBQTJCLDBCQUEwQixlQUFlO0FBQUEsUUFDeEY7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxTQUFTLE9BQU8sYUFBYSxpQkFBaUIsS0FBSztBQUFBLEVBQy9EO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixTQUFTLEtBQUssc0RBQXNELGVBQWU7QUFBQSxJQUNyRjtBQUFBLElBQ0EsUUFBUSxDQUFDLFNBQVMsYUFBYSxXQUFXLGVBQWU7QUFBQSxFQUMzRDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsT0FBTztBQUFBLFFBRUwsdUJBQXVCLEtBQUssUUFBUSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUM7QUFBQSxNQUN4RDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
