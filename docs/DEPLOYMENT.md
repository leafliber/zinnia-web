# Zinnia Web 部署指南

> 本文档介绍如何将 Zinnia Web 前端应用部署到各种平台。

---

## 目录

1. [准备工作](#准备工作)
2. [GitHub Pages 部署](#github-pages-部署)
3. [Cloudflare Pages 部署](#cloudflare-pages-部署)
4. [其他平台部署](#其他平台部署)
5. [环境变量配置](#环境变量配置)
6. [常见问题](#常见问题)

---

## 准备工作

### 1. 环境要求

- Node.js 18+ 或 20+
- npm 或 yarn
- Git

### 2. 本地构建测试

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入实际的 API 地址：

```env
VITE_API_BASE_URL=https://api.zinnia.example.com/api/v1
```

---

## GitHub Pages 部署

### 方式一：使用 GitHub Actions（推荐）

已配置好的自动部署流程位于 `.github/workflows/deploy.yml`。

#### 步骤：

1. **启用 GitHub Pages**

   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"

2. **配置 Secrets**

   在仓库 Settings → Secrets and variables → Actions 中添加：

   | 名称 | 值 | 说明 |
   |------|-----|------|
   | `VITE_API_BASE_URL` | `https://api.zinnia.example.com/api/v1` | API 服务器地址 |

3. **配置 Variables（可选）**

   在仓库 Settings → Secrets and variables → Actions → Variables 中添加：

   | 名称 | 值 |
   |------|-----|
   | `VITE_APP_NAME` | `Zinnia` |
   | `VITE_APP_TITLE` | `设备监控平台` |

4. **触发部署**

   ```bash
   git add .
   git commit -m "chore: 配置 GitHub Pages 部署"
   git push origin main
   ```

5. **访问应用**

   部署完成后，访问：`https://<username>.github.io/<repo-name>/`

### 方式二：手动部署

```bash
# 构建
npm run build

# 安装 gh-pages
npm install -g gh-pages

# 部署到 gh-pages 分支
gh-pages -d dist
```

### 配置自定义域名（可选）

1. 在 `public/` 目录下创建 `CNAME` 文件：

   ```
   zinnia.example.com
   ```

2. 在 DNS 服务商添加 CNAME 记录：

   ```
   zinnia.example.com  →  <username>.github.io
   ```

3. 在 GitHub 仓库 Settings → Pages → Custom domain 中填入域名

---

## Cloudflare Pages 部署

### 方式一：通过 GitHub 集成（推荐）

#### 步骤：

1. **登录 Cloudflare Dashboard**

   - 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
   - 点击 "Create a project"

2. **连接 GitHub 仓库**

   - 选择 "Connect to Git"
   - 授权 Cloudflare 访问 GitHub
   - 选择 `zinnia-web` 仓库

3. **配置构建设置**

   | 设置项 | 值 |
   |--------|-----|
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `/` |
   | Node version | `20` |

4. **配置环境变量**

   在 Settings → Environment variables 中添加：

   ```
   VITE_API_BASE_URL=https://api.zinnia.example.com/api/v1
   ```

5. **部署**

   - 点击 "Save and Deploy"
   - Cloudflare 会自动开始构建和部署
   - 部署完成后，会提供一个 `*.pages.dev` 域名

### 方式二：使用 GitHub Actions

已配置好的流程位于 `.github/workflows/cloudflare.yml`。

#### 步骤：

1. **获取 Cloudflare 凭证**

   - API Token: 访问 [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - 创建 Token，权限选择 "Cloudflare Pages - Edit"
   - Account ID: 在 Cloudflare Dashboard 右侧可找到

2. **配置 GitHub Secrets**

   在仓库 Settings → Secrets 中添加：

   | 名称 | 说明 |
   |------|------|
   | `CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
   | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
   | `VITE_API_BASE_URL` | API 服务器地址 |

3. **触发部署**

   ```bash
   git push origin main
   ```

### 方式三：使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build

# 部署
wrangler pages deploy dist --project-name=zinnia-web
```

### 配置自定义域名

1. 在 Cloudflare Pages 项目中，进入 Custom domains
2. 点击 "Set up a custom domain"
3. 输入域名（如 `zinnia.example.com`）
4. Cloudflare 会自动配置 DNS 记录

---

## 其他平台部署

### Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

**或使用 GitHub 集成**：
1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 配置环境变量
4. 部署

### Netlify

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 构建
npm run build

# 部署
netlify deploy --prod --dir=dist
```

**或使用 GitHub 集成**：
1. 访问 [Netlify](https://netlify.com)
2. 导入 GitHub 仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 部署

### Docker 容器

创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service Worker
    location = /sw.js {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

构建并运行：

```bash
# 构建镜像
docker build -t zinnia-web .

# 运行容器
docker run -p 8080:80 zinnia-web
```

---

## 环境变量配置

### 可用的环境变量

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_API_BASE_URL` | ✅ | `/api/v1` | 后端 API 基础路径 |
| `VITE_APP_NAME` | ❌ | `Zinnia` | 应用名称 |
| `VITE_APP_TITLE` | ❌ | `设备监控平台` | 应用标题 |
| `VITE_RECAPTCHA_SITE_KEY` | ❌ | - | reCAPTCHA Site Key |
| `VITE_GA_TRACKING_ID` | ❌ | - | Google Analytics ID |
| `VITE_SENTRY_DSN` | ❌ | - | Sentry DSN |

### 不同平台的环境变量设置

#### GitHub Actions

在 `.github/workflows/deploy.yml` 中使用 `secrets` 和 `vars`：

```yaml
env:
  VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
  VITE_APP_NAME: ${{ vars.VITE_APP_NAME }}
```

#### Cloudflare Pages

在项目 Settings → Environment variables 中设置。

#### Vercel / Netlify

在项目设置中的 Environment Variables 部分添加。

---

## 常见问题

### 1. SPA 路由 404 问题

**问题**：刷新页面时出现 404 错误。

**解决**：
- GitHub Pages: 使用 `_redirects` 文件（已配置）
- Cloudflare Pages: 自动处理 SPA 路由
- Nginx: 使用 `try_files $uri $uri/ /index.html;`

### 2. API 跨域问题

**问题**：前端无法访问后端 API。

**解决**：
1. 后端配置 CORS：允许前端域名
2. 或使用 API 代理（在 `vite.config.ts` 中配置）

### 3. 环境变量不生效

**问题**：构建后环境变量没有被替换。

**解决**：
1. 确保环境变量以 `VITE_` 开头
2. 在构建前设置环境变量
3. 检查 `.env` 文件是否正确加载

### 4. 构建产物过大

**问题**：dist 目录体积过大。

**优化**：
1. 启用代码分割
2. 按需导入组件
3. 使用 CDN 加载第三方库
4. 启用 Gzip/Brotli 压缩

### 5. Service Worker 缓存问题

**问题**：更新后用户看到的还是旧版本。

**解决**：
1. 修改 `sw.js` 中的 `CACHE_NAME` 版本号
2. 在应用中添加更新提示
3. 设置合理的缓存策略

---

## 性能优化建议

### 1. 启用 CDN

将静态资源托管到 CDN：
- 图片、字体等
- 第三方库（可选）

### 2. 资源压缩

```bash
# 压缩图片
npm install -D vite-plugin-imagemin

# 压缩代码
# Vite 默认已启用
```

### 3. 预加载关键资源

在 `index.html` 中添加：

```html
<link rel="preconnect" href="https://api.zinnia.example.com">
<link rel="dns-prefetch" href="https://api.zinnia.example.com">
```

### 4. 监控性能

使用工具：
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Google Analytics](https://analytics.google.com/)

---

## 安全建议

### 1. 环境变量安全

- ❌ 不要在代码中硬编码敏感信息
- ✅ 使用 CI/CD 平台的 Secrets 功能
- ✅ 定期轮换 API 密钥

### 2. Content Security Policy

已在 `_headers` 文件中配置，根据实际情况调整。

### 3. HTTPS

- 确保使用 HTTPS
- 启用 HSTS
- 使用安全的 Cookie 设置

---

## 回滚策略

### GitHub Pages

```bash
# 回滚到上一个版本
git revert HEAD
git push origin main
```

### Cloudflare Pages

在 Cloudflare Dashboard 中：
1. 进入项目的 Deployments
2. 选择要回滚的版本
3. 点击 "Rollback to this deployment"

### 使用 Git Tags

```bash
# 创建版本标签
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0

# 回滚到特定版本
git checkout v1.0.0
npm run build
# 然后重新部署
```

---

## 联系支持

如遇到部署问题，请：
1. 查看 GitHub Actions 日志
2. 查看平台的构建日志
3. 提交 Issue 到仓库

---

**最后更新**：2026-01-13
