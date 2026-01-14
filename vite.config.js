import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var _b;
    var mode = _a.mode;
    return ({
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        // GitHub Pages 部署时需要设置 base，本地开发时为 /
        base: mode === 'production' && process.env.GITHUB_PAGES === 'true'
            ? "/".concat(((_b = process.env.GITHUB_REPOSITORY) === null || _b === void 0 ? void 0 : _b.split('/')[1]) || '', "/")
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
            // 优化分块策略（避免循环依赖）
            rollupOptions: {
                output: {
                    manualChunks: function (id) {
                        // 仅分离 ECharts（最大的独立包）
                        if (id.includes('node_modules/echarts') ||
                            id.includes('node_modules/zrender')) {
                            return 'echarts';
                        }
                        // 所有其他 node_modules 依赖放在一起，避免循环依赖
                        if (id.includes('node_modules')) {
                            return 'vendor';
                        }
                        // 应用代码由 Vite 自动处理
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
    });
});
