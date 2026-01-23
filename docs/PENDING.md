# 待完成事项

本文档记录项目当前未完成的待办事项。

> **说明**：API 相关的内容已全部完成并记录在 `docs/API_FRONTEND.md` 中。

---

## 待完成

### 应用截图

在 `public/screenshots/` 目录下添加：
- [ ] desktop.png (1920x1080) - 桌面端界面截图
- [ ] mobile.png (750x1334) - 移动端界面截图

> **用途**：PWA 安装界面会展示应用截图

---

## GitHub Actions 缺失

以下配置文件需要创建：
- [ ] `.github/workflows/deploy.yml` - GitHub Pages 部署
- [ ] `.github/workflows/cloudflare.yml` - Cloudflare Pages 部署

---

## 代码缺失

### 单元测试

项目当前没有单元测试，建议覆盖：
- [ ] `src/hooks/*.ts` - 自定义 Hooks
- [ ] `src/stores/*.ts` - Zustand Stores
- [ ] `src/utils/*.ts` - 工具函数
