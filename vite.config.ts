import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // GitHub Pages 部署时需要设置 base，本地开发时为 /
  base: mode === 'production' && process.env.GITHUB_PAGES === 'true' 
    ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || ''}/` 
    : '/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 生成 source map 用于调试
    sourcemap: mode !== 'production',
    // 增加 chunk 大小警告限制到 1500KB
    chunkSizeWarningLimit: 1500,
    // 优化分块策略
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ECharts 和相关依赖（最大的包，单独分离）
          if (id.includes('node_modules/echarts') || 
              id.includes('node_modules/zrender') ||
              id.includes('echarts-for-react')) {
            return 'echarts'
          }
          // React 生态系统（必须在 antd 之前，避免循环依赖）
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/scheduler')) {
            return 'react'
          }
          // Ant Design 核心和相关依赖（包含图标）
          if (id.includes('node_modules/antd') || 
              id.includes('node_modules/@ant-design') ||
              id.includes('node_modules/rc-') ||
              id.includes('node_modules/@rc-component')) {
            return 'antd'
          }
          // 其他 node_modules 依赖
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
    // 使用 esbuild 压缩（Vite 7 默认且推荐）
    minify: 'esbuild',
    // esbuild 压缩选项
    esbuild: mode === 'production' ? {
      drop: ['console', 'debugger'],
    } : undefined,
  },
  // PWA 支持
  // 如需更完善的 PWA 支持，可以安装 vite-plugin-pwa
}))

