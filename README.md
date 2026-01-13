# Zinnia Web 前端项目

> 🌸 设备电量监控与预警系统 - Web 管理端

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **路由**: React Router v6
- **状态管理**: Zustand
- **UI 组件库**: Ant Design 5
- **HTTP 客户端**: Axios
- **图表**: ECharts

## 功能特性

- ✅ 用户注册/登录/登出
- ✅ JWT Token 自动刷新
- ✅ 设备管理（列表、创建、详情、配置）
- ✅ API Key 管理（创建、轮换）
- ✅ 设备访问令牌管理
- ✅ 电量数据可视化
- ✅ 预警规则配置
- ✅ 预警事件管理
- ✅ 个人资料设置
- ✅ 安全设置（修改密码、登出所有设备）

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并根据需要修改：

```bash
cp .env.example .env
```

环境变量说明：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | API 基础路径 | `http://localhost:8080/api/v1` |
| `VITE_APP_TITLE` | 应用标题 | `Zinnia 设备监控平台` |
| `VITE_TOKEN_REFRESH_INTERVAL` | Token 刷新间隔（毫秒） | `720000` (12分钟) |

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

## 项目结构

```
src/
├── api/                # API 层
│   ├── client.ts       # Axios 实例（含 Token 自动刷新）
│   ├── auth.ts         # 用户认证 API
│   ├── devices.ts      # 设备管理 API
│   ├── battery.ts      # 电量数据 API
│   └── alerts.ts       # 预警管理 API
│
├── components/         # 通用组件
│   ├── common/         # 基础组件
│   ├── layout/         # 布局组件
│   └── charts/         # 图表组件
│
├── pages/              # 页面组件
│   ├── auth/           # 登录/注册
│   ├── dashboard/      # 仪表盘
│   ├── devices/        # 设备管理
│   ├── tokens/         # 令牌管理
│   ├── alerts/         # 预警管理
│   └── settings/       # 个人设置
│
├── hooks/              # 自定义 Hooks
├── stores/             # Zustand 状态
├── types/              # TypeScript 类型
├── utils/              # 工具函数
├── routes/             # 路由配置
├── styles/             # 全局样式
├── App.tsx             # 根组件
└── main.tsx            # 入口文件
```

## API 对接

本项目对接 Zinnia 后端 API，详细接口文档请参考 [docs/API_REFERENCE.md](docs/API_REFERENCE.md)。

### 认证机制

- 用户认证使用 JWT Token
- Access Token 有效期 15 分钟
- 前端每 12 分钟自动刷新 Token
- Token 过期时自动跳转登录页

### 开发代理

开发环境下，API 请求会代理到 `http://localhost:8080`，可在 `vite.config.ts` 中修改。

## 部署

支持多种部署方式，详细说明请参考 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

### 快速部署

#### GitHub Pages

```bash
# 配置 GitHub Actions 后，推送即可自动部署
git push origin main
```

#### Cloudflare Pages

```bash
# 方式一：通过 GitHub 集成（推荐）
# 在 Cloudflare Dashboard 连接 GitHub 仓库

# 方式二：使用 Wrangler CLI
npm run build
wrangler pages deploy dist --project-name=zinnia-web
```

#### 其他平台

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist

# Docker
docker build -t zinnia-web .
docker run -p 8080:80 zinnia-web
```

### 环境变量配置

部署时需要设置以下环境变量：

```env
VITE_API_BASE_URL=https://api.zinnia.example.com/api/v1
```

## PWA 支持

本项目已配置为 Progressive Web App (PWA)，支持：

- ✅ 离线访问（Service Worker）
- ✅ 安装到主屏幕（manifest.json）
- ✅ 推送通知
- ✅ 响应式设计（移动端/平板/桌面）

## 开发规范

### 代码风格

- 使用 ESLint + Prettier
- 使用函数式组件 + Hooks
- 组件文件使用 PascalCase 命名

### 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 相关文档

- [API 使用清单](docs/FRONTEND_API_USAGE.md) - 前端使用的 API 接口清单
- [后端 API 参考](docs/API_REFERENCE.md) - 完整的后端 API 文档
- [部署指南](docs/DEPLOYMENT.md) - 详细的部署说明
- [注册安全文档](docs/registration-security.md) - 注册功能的安全设计

## License

MIT

