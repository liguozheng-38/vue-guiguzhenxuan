import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 按需引入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// mock 插件
// import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ mode }) => {
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),

      // Element Plus 自动按需引入
      AutoImport({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      }),

      // ✅ mock 配置（开发环境启用）
      //   viteMockServe({
      //     mockPath: 'src/mock',
      //     localEnabled: command === 'serve',
      //   }),
    ],

    // @ 符号别名配置
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // scss 全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variable.scss" as *;`,
        },
      },
    },
    //代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          // rewrite: (path) => path.replace(/^\/api/, ''),
          rewrite: (path) =>
            path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ''),
        },
      },
    },
  }
})
