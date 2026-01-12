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

## License

MIT
