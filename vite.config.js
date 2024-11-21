/* eslint-disable quotes */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
// 自动导入
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 解决使用AutoImport后 elementPlus的message, notification等失效的问题
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'

// 提升压缩性能
import viteCompression from 'vite-plugin-compression'
import vue from '@vitejs/plugin-vue'
// 支持jsx
import vueJsx from '@vitejs/plugin-vue-jsx'
// elementIcon按需引入
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    visualizer(),

    AutoImport({
      imports: ['vue', 'vue-router', 'vuex'],
      eslintrc: {
        enabled: true
      },
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon'
        })
      ]
    }),
    createStyleImportPlugin({
      resolves: [
        ElementPlusResolve()
      ],
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: name => `element-plus/theme-chalk/${name}.css`
        }
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        }),
        IconsResolver({
          prefix: 'Icon',
          enabledCollections: ['ep']
        })
      ]
    }),
    Icons({
      autoInstall: true
    }),
    viteCompression({
      ext: '.tar'
    })
  ],
  server: {
    host: true, // 监听所有地址
    port: 8083,
    hmr: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/elementPlus/index.scss" as *;@use "@/assets/utils.scss" as *;`
      }
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境时移除console
        drop_console: true,
        drop_debugger: true
      }

    }
  }
})
