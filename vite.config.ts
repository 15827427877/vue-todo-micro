import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 开发服务器配置
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 3000,      // 项目端口
    open: true,      // 自动打开浏览器
    // 后端接口代理（解决跨域）
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true,
      }
    }
  },
  // 打包配置
  build: {
    outDir: 'dist', // 打包后文件夹名称
    sourcemap: false
  }
})