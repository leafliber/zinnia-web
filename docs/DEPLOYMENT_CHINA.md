# 国内部署建议

针对中国大陆用户的特殊部署建议和优化方案。

---

## 🇨🇳 国内可访问的部署平台

### 推荐平台

| 平台 | 国内访问 | 费用 | 部署难度 | 推荐度 |
|------|---------|------|---------|--------|
| **Cloudflare Pages** | ✅ 良好 | 免费 | 简单 | ⭐⭐⭐⭐⭐ |
| **Vercel** | ⚠️ 不稳定 | 免费 | 简单 | ⭐⭐⭐ |
| **阿里云 OSS + CDN** | ✅ 优秀 | 付费 | 中等 | ⭐⭐⭐⭐ |
| **腾讯云 COS + CDN** | ✅ 优秀 | 付费 | 中等 | ⭐⭐⭐⭐ |
| **又拍云** | ✅ 优秀 | 付费 | 简单 | ⭐⭐⭐⭐ |
| **GitHub Pages** | ❌ 无法访问 | 免费 | 简单 | ❌ 不推荐 |
| **Netlify** | ❌ 无法访问 | 免费 | 简单 | ❌ 不推荐 |

---

## 🚀 Cloudflare Pages 部署（推荐）

### 为什么推荐 Cloudflare

1. ✅ 国内访问速度良好
2. ✅ 完全免费，无流量限制
3. ✅ 支持自动 HTTPS
4. ✅ 支持自定义域名
5. ✅ 自动 CI/CD
6. ✅ 支持预览部署

### 部署步骤

详见 [快速开始指南](QUICK_START.md#部署到-cloudflare-pages)

### 使用国内域名

Cloudflare 提供的 `*.pages.dev` 域名在国内可访问，但建议绑定自己的域名：

1. **购买域名**
   - 国内：阿里云、腾讯云、华为云
   - 国际：Cloudflare、Namecheap

2. **配置 DNS**
   - 推荐使用 Cloudflare DNS（国内可访问）
   - 或使用国内 DNS（阿里云、腾讯云）

3. **绑定域名**
   - 在 Cloudflare Pages 项目中添加自定义域名
   - 按提示配置 CNAME 记录

---

## 🏢 国内云服务商部署

### 阿里云 OSS + CDN

#### 优势
- ✅ 国内访问速度极快
- ✅ 稳定可靠
- ✅ 支持备案域名

#### 部署步骤

1. **创建 OSS Bucket**
```bash
# 登录阿里云控制台
# 对象存储 OSS → Bucket 列表 → 创建 Bucket
# 读写权限：公共读
```

2. **配置静态网站**
```bash
# Bucket 设置 → 静态页面
# 默认首页：index.html
# 默认 404 页：index.html（SPA 支持）
```

3. **上传构建产物**
```bash
# 安装阿里云 CLI
npm install -g @alicloud/cli

# 配置凭证
aliyun configure

# 上传文件
npm run build
aliyun oss cp -r dist/ oss://your-bucket-name/
```

4. **配置 CDN（可选但推荐）**
```bash
# CDN → 域名管理 → 添加域名
# 源站类型：OSS 域名
# 加速域名：your-cdn-domain.com
```

5. **配置缓存规则**
```
- /index.html: 不缓存
- /assets/*: 缓存 1 年
- /sw.js: 不缓存
```

### 腾讯云 COS + CDN

类似阿里云，步骤基本相同：

1. 创建 COS 存储桶
2. 配置静态网站托管
3. 使用 COSCMD 上传文件
4. 配置 CDN 加速

```bash
# 安装工具
pip install coscmd

# 配置
coscmd config -a <SecretId> -s <SecretKey> -b <BucketName> -r <Region>

# 上传
npm run build
coscmd upload -r dist/ /
```

---

## 🔧 国内访问优化

### 1. API 域名优化

如果后端 API 在国外，考虑：

#### 选项 A：使用国内中转服务器

```nginx
# Nginx 反向代理配置
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location /api/ {
        proxy_pass https://your-overseas-api.com/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 选项 B：使用 Cloudflare Workers 中转

```javascript
// workers.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  url.hostname = 'your-overseas-api.com'
  
  return fetch(url, {
    method: request.method,
    headers: request.headers,
    body: request.body
  })
}
```

### 2. 静态资源 CDN

使用国内 CDN 加速第三方库：

```html
<!-- 使用 BootCDN -->
<script src="https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
```

或在 `vite.config.ts` 中配置：

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
```

### 3. 字体优化

使用国内字体 CDN：

```css
/* 使用字体天下或其他国内字体 CDN */
@font-face {
  font-family: 'SourceHanSans';
  src: url('https://cdn.example.com/fonts/SourceHanSans.woff2');
}
```

---

## 📊 性能优化建议

### 1. 启用 Gzip/Brotli 压缩

大多数 CDN 默认已启用，如果自己搭建服务器：

```nginx
# Nginx 配置
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

# Brotli（如果支持）
brotli on;
brotli_types text/plain text/css application/json application/javascript;
```

### 2. 预加载关键资源

```html
<link rel="dns-prefetch" href="//api.yourdomain.com">
<link rel="preconnect" href="//api.yourdomain.com" crossorigin>
```

### 3. 图片优化

```bash
# 使用 WebP 格式
# 使用图片 CDN（七牛云、又拍云）
# 启用懒加载
```

---

## 🔐 域名备案

### 使用国内服务器需要备案

如果使用阿里云、腾讯云等国内服务商：

1. **准备材料**
   - 域名证书
   - 身份证
   - 企业营业执照（企业备案）

2. **备案流程**
   - 在服务商控制台提交备案申请
   - 等待管局审核（通常 7-20 天）

3. **备案后配置**
   - 在网站底部添加备案号
   - 链接到工信部备案查询网站

### 不需要备案的情况

- 使用 Cloudflare Pages（`*.pages.dev` 域名）
- 使用海外服务器
- 仅作为开发/测试环境

---

## 🚫 避坑指南

### 1. GitHub Pages 无法访问

**问题**：GitHub Pages 在国内无法稳定访问。

**解决**：
- 使用 Cloudflare Pages
- 或使用国内云服务商

### 2. Vercel 访问不稳定

**问题**：Vercel 在国内访问时快时慢。

**解决**：
- 优先使用 Cloudflare Pages
- 或绑定自定义域名并使用 Cloudflare CDN

### 3. npm 安装慢

**问题**：npm 官方源速度慢。

**解决**：
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 或使用 pnpm
npm install -g pnpm
pnpm config set registry https://registry.npmmirror.com
```

### 4. 字体加载慢

**问题**：Google Fonts 无法访问。

**解决**：
- 使用本地字体文件
- 使用国内字体 CDN
- 或使用系统字体

---

## 💡 推荐配置方案

### 方案一：纯免费方案（推荐新手）

```
前端：Cloudflare Pages（免费）
后端：海外服务器 + Cloudflare Workers 中转
数据库：PlanetScale / Supabase（免费层）
```

**优点**：
- 完全免费
- 配置简单
- 国内可访问

**缺点**：
- 速度不是最优

### 方案二：性能优先方案

```
前端：阿里云 OSS + CDN
后端：国内服务器（需备案）
数据库：阿里云 RDS / MongoDB Atlas
```

**优点**：
- 速度极快
- 稳定可靠

**缺点**：
- 需要付费
- 需要备案

### 方案三：混合方案（推荐）

```
前端：Cloudflare Pages
后端：Cloudflare Workers 中转 → 海外服务器
数据库：海外服务器
CDN：Cloudflare
```

**优点**：
- 免费或低成本
- 无需备案
- 性能良好

**缺点**：
- 配置略复杂

---

## 📱 移动端访问优化

### 1. 使用 PWA

已配置，用户可以：
- 添加到主屏幕
- 离线访问
- 类似原生 App 体验

### 2. 响应式设计

已实现，自动适配：
- 手机（< 768px）
- 平板（768-1024px）
- 桌面（> 1024px）

### 3. 触摸优化

已配置，触摸设备：
- 更大的点击区域
- 移除 hover 效果
- 优化滚动体验

---

## 🔍 监控和分析

### 推荐工具

1. **阿里云 ARMS**
   - 前端监控
   - 性能分析
   - 错误追踪

2. **百度统计**
   - 免费
   - 国内用户友好
   - 详细数据分析

3. **神策数据**
   - 专业级分析
   - 支持私有化部署

### 配置示例

```typescript
// 百度统计
declare global {
  interface Window {
    _hmt: any[]
  }
}

// 在 main.tsx 中
if (import.meta.env.VITE_BAIDU_ANALYTICS_ID) {
  const script = document.createElement('script')
  script.src = `https://hm.baidu.com/hm.js?${import.meta.env.VITE_BAIDU_ANALYTICS_ID}`
  document.head.appendChild(script)
}
```

---

## 📞 技术支持

### 国内技术社区

- [掘金](https://juejin.cn)
- [思否](https://segmentfault.com)
- [CSDN](https://csdn.net)
- [V2EX](https://v2ex.com)

### 云服务商文档

- [阿里云文档](https://help.aliyun.com)
- [腾讯云文档](https://cloud.tencent.com/document)
- [Cloudflare 文档](https://developers.cloudflare.com)

---

**最后更新**：2026-01-13
