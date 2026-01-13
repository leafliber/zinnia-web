# Zinnia Web 快速开始

本指南帮助你快速部署 Zinnia Web 前端应用。

---

## 前置要求

- Node.js 18+ 或 20+
- npm 或 yarn
- Git

---

## 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/your-username/zinnia-web.git
cd zinnia-web
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，修改 API 地址：

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 部署到 GitHub Pages

### 方法一：自动部署（推荐）

1. **Fork/推送代码到 GitHub**

```bash
git remote add origin https://github.com/your-username/zinnia-web.git
git push -u origin main
```

2. **配置 GitHub Secrets**

进入仓库 Settings → Secrets and variables → Actions，添加：

- `VITE_API_BASE_URL`: 你的 API 地址（如 `https://api.zinnia.example.com/api/v1`）

3. **启用 GitHub Pages**

进入仓库 Settings → Pages：
- Source 选择 "GitHub Actions"

4. **触发部署**

推送到 main 分支即可自动部署：

```bash
git push origin main
```

5. **访问应用**

部署完成后访问：`https://your-username.github.io/zinnia-web/`

---

## 部署到 Cloudflare Pages

### 方法一：通过 Dashboard（推荐新手）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages → Create a project
3. 选择 "Connect to Git"
4. 授权并选择 `zinnia-web` 仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: 添加 `VITE_API_BASE_URL`
6. 点击 "Save and Deploy"

### 方法二：使用 GitHub Actions

1. **获取 Cloudflare 凭证**

- API Token: [创建 Token](https://dash.cloudflare.com/profile/api-tokens)
  - 权限：Cloudflare Pages - Edit
- Account ID: 在 Dashboard 右侧可见

2. **配置 GitHub Secrets**

添加以下 Secrets：
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `VITE_API_BASE_URL`

3. **推送触发部署**

```bash
git push origin main
```

### 方法三：使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 构建项目
npm run build

# 部署
wrangler pages deploy dist --project-name=zinnia-web
```

---

## 部署到其他平台

### Vercel

```bash
# 安装 CLI
npm install -g vercel

# 部署
vercel --prod
```

或在 [Vercel Dashboard](https://vercel.com) 导入 GitHub 仓库。

### Netlify

```bash
# 安装 CLI
npm install -g netlify-cli

# 构建
npm run build

# 部署
netlify deploy --prod --dir=dist
```

或在 [Netlify Dashboard](https://app.netlify.com) 导入 GitHub 仓库。

---

## 常见问题

### 1. 构建失败

**问题**：`npm run build` 失败。

**解决**：
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 2. API 连接失败

**问题**：前端无法连接后端 API。

**解决**：
1. 检查 `VITE_API_BASE_URL` 是否正确
2. 检查后端 CORS 配置是否允许前端域名
3. 检查后端服务是否运行

### 3. 页面刷新 404

**问题**：部署后刷新页面出现 404。

**解决**：
- GitHub Pages: 已配置 `_redirects` 文件
- Cloudflare Pages: 自动支持 SPA 路由
- 其他平台: 配置服务器将所有请求重定向到 `index.html`

### 4. 环境变量不生效

**问题**：环境变量没有被替换。

**解决**：
1. 确保变量名以 `VITE_` 开头
2. 重新构建项目
3. 清除浏览器缓存

---

## 下一步

- 📖 阅读 [完整部署文档](DEPLOYMENT.md)
- 🔍 查看 [API 使用清单](FRONTEND_API_USAGE.md)
- 🎨 自定义 PWA 图标和主题

---

**需要帮助？**

- 查看 [Issues](https://github.com/your-username/zinnia-web/issues)
- 阅读完整文档
