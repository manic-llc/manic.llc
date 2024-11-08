import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import SVG from 'vite-svg-loader'
import Rewrite from 'vite-plugin-rewrite-all'
import { fileURLToPath } from 'url'
import { VueRouterAutoImports } from 'unplugin-vue-router'

const imports: any = ['vue', 'vue/macros', 'pinia', 'vue', VueRouterAutoImports]
const dts = 'src/auto-imports.d.ts'
const dirs = ['src/**/*', './node_modules/calo-vue/src/**/*']
const componentDirs = ['src/components', './node_modules/calo-vue/src/components']

const plugins = [
  VueRouter({
    routeBlockLang: 'yaml',
  }),
  Vue(),
  SVG({ defaultImport: 'component' }),
  Rewrite(),
  AutoImport({
    imports,
    dts,
    dirs,
  }),
  Components({
    dts: true,
    dirs: componentDirs,
  }),
]

const css = {
  preprocessorOptions: {
    scss: {
      additionalData: `
          @use 'sass:math';
          @use '@/styles/index.scss' as *;
        `,
    },
  },
}

const resolve = {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
}

export default defineConfig({
  plugins,
  css,
  resolve,
})
