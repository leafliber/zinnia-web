# 部署配置清单

本文档列出了所有与部署相关的配置文件。

---

## 📁 配置文件清单

### 环境变量配置

| 文件 | 用途 | 提交到 Git |
|------|------|-----------|
| `.env.example` | 环境变量示例模板 | ✅ 是 |
| `.env.local` | 本地开发配置 | ❌ 否 |
| `.env.production` | 生产环境默认配置 | ✅ 是 |

### CI/CD 工作流

| 文件 | 平台 | 触发条件 |
|------|------|----------|
| `.github/workflows/deploy.yml` | GitHub Pages | push to main |
| `.github/workflows/cloudflare.yml` | Cloudflare Pages | push to main |

### 部署平台配置

| 文件 | 平台 | 说明 |
|------|------|------|
| `wrangler.toml` | Cloudflare Workers/Pages | 项目配置 |
| `public/_redirects` | Cloudflare/Netlify | SPA 路由重定向 |
| `public/_headers` | Cloudflare/Netlify | 安全响应头 |

### PWA 配置

| 文件 | 用途 |
|------|------|
| `public/manifest.json` | PWA 清单文件 |
| `public/sw.js` | Service Worker |
| `index.html` | PWA meta 标签 |

### 脚本文件

| 文件 | 用途 |
|------|------|
| `scripts/deploy.sh` | 通用部署脚本 |

### 其他配置

| 文件 | 用途 |
|------|------|
| `vite.config.ts` | Vite 构建配置（含部署优化） |
| `.gitignore` | Git 忽略规则 |

---

## 🔐 敏感信息管理

### ⚠️ 永远不要提交到 Git 的文件

- ❌ `.env.local`
- ❌ `.env` (除非是示例)
- ❌ 任何包含 API 密钥、Token 的文件

### ✅ 应该提交到 Git 的文件

- ✅ `.env.example` (示例模板)
- ✅ `.env.production` (仅包含公开配置)
- ✅ 所有 CI/CD 配置文件
- ✅ 部署脚本

---

## 🚀 部署前检查清单

### GitHub Pages 部署

- [ ] 推送代码到 GitHub
- [ ] 在仓库 Settings → Secrets 中配置 `VITE_API_BASE_URL`
- [ ] 在仓库 Settings → Pages 中选择 "GitHub Actions"
- [ ] 推送到 main 分支触发部署
- [ ] 检查 Actions 日志确认部署成功

### Cloudflare Pages 部署

#### 通过 Dashboard

- [ ] 登录 Cloudflare Dashboard
- [ ] 连接 GitHub 仓库
- [ ] 配置构建设置（build command, output dir）
- [ ] 添加环境变量 `VITE_API_BASE_URL`
- [ ] 保存并部署

#### 通过 GitHub Actions

- [ ] 创建 Cloudflare API Token
- [ ] 在 GitHub Secrets 中添加 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`
- [ ] 添加 `VITE_API_BASE_URL`
- [ ] 推送到 main 分支

---

## 📊 构建优化配置

已在 `vite.config.ts` 中配置：

### 代码分割策略

```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'antd-vendor': ['antd', '@ant-design/icons'],
  'chart-vendor': ['echarts', 'echarts-for-react'],
}
```

### 压缩配置

- ✅ 生产环境移除 console 和 debugger
- ✅ Terser 压缩
- ✅ 自动 Tree Shaking

---

## 🔒 安全配置

已在 `public/_headers` 中配置：

- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection
- ✅ Content Security Policy
- ✅ Referrer-Policy
- ✅ Permissions-Policy

---

## 📱 PWA 配置

### Manifest.json 配置项

- ✅ name, short_name
- ✅ icons (72-512px)
- ✅ start_url, display
- ✅ theme_color, background_color
- ✅ screenshots (desktop & mobile)

### Service Worker 功能

- ✅ 静态资源缓存
- ✅ 网络优先策略
- ✅ 推送通知支持
- ✅ 离线访问

---

## 📝 待生成的资源

### 图标文件

需要在 `public/icons/` 目录下生成：

- [ ] icon-72x72.png
- [ ] icon-96x96.png
- [ ] icon-128x128.png
- [ ] icon-144x144.png
- [ ] icon-152x152.png
- [ ] icon-192x192.png
- [ ] icon-384x384.png
- [ ] icon-512x512.png

**工具推荐**：https://realfavicongenerator.net/

### 截图文件

需要在 `public/screenshots/` 目录下添加：

- [ ] desktop.png (1920x1080) - 桌面端界面截图
- [ ] mobile.png (750x1334) - 移动端界面截图

---

## 🧪 测试清单

### 部署前测试

- [ ] `npm run build` 成功
- [ ] `npm run preview` 可正常访问
- [ ] 所有路由可以访问
- [ ] API 调用正常
- [ ] 响应式布局正常（移动/平板/桌面）

### 部署后测试

- [ ] 主页可以访问
- [ ] 刷新页面不会 404
- [ ] API 请求正常
- [ ] 静态资源加载成功
- [ ] Service Worker 注册成功
- [ ] PWA 可安装

---

## 📚 相关文档

- [部署指南](DEPLOYMENT.md) - 详细部署说明
- [快速开始](QUICK_START.md) - 快速部署步骤
- [API 清单](FRONTEND_API_USAGE.md) - API 接口清单

---

**最后更新**：2026-01-13
