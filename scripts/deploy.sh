#!/bin/bash

# Zinnia Web 部署脚本
# 用法: ./scripts/deploy.sh [环境名称]

set -e

ENVIRONMENT=${1:-production}

echo "🚀 开始部署 Zinnia Web..."
echo "📦 目标环境: $ENVIRONMENT"

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
echo "📌 Node.js 版本: $NODE_VERSION"

# 安装依赖
echo "📥 安装依赖..."
npm ci

# 类型检查
echo "🔍 类型检查..."
npm run build -- --mode $ENVIRONMENT || {
  echo "❌ 类型检查失败"
  exit 1
}

# 构建项目
echo "🔨 构建项目..."
npm run build || {
  echo "❌ 构建失败"
  exit 1
}

# 验证构建产物
if [ ! -d "dist" ]; then
  echo "❌ 构建产物目录不存在"
  exit 1
fi

echo "✅ 构建完成！"
echo "📁 构建产物位于: ./dist"

# 检查构建产物大小
DIST_SIZE=$(du -sh dist | cut -f1)
echo "📊 构建产物大小: $DIST_SIZE"

# 列出主要文件
echo ""
echo "📋 主要文件:"
ls -lh dist/index.html
ls -lh dist/manifest.json 2>/dev/null || echo "  ⚠️  manifest.json 不存在"
ls -lh dist/sw.js 2>/dev/null || echo "  ⚠️  sw.js 不存在"

echo ""
echo "✨ 部署准备完成！"
echo ""
echo "下一步操作："
echo "  • GitHub Pages: git push origin main"
echo "  • Cloudflare Pages: 自动部署（已配置 GitHub Actions）"
echo "  • 手动部署: 上传 dist/ 目录到服务器"
