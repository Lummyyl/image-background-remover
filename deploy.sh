#!/bin/bash

# Cloudflare Pages 部署脚本

echo "🚀 开始部署图像背景移除工具到 Cloudflare Pages..."

# 检查环境变量
if [ -z "$CLOUDFLARE_ACCOUNT_ID" ] || [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ 缺少 Cloudflare 环境变量"
    echo "请设置 CLOUDFLARE_ACCOUNT_ID 和 CLOUDFLARE_API_TOKEN"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

echo "✅ 构建成功"

# 部署到 Cloudflare Pages
echo "🚀 部署到 Cloudflare Pages..."
npx wrangler pages deploy dist

echo "🎉 部署完成！"
echo "📱 访问地址: https://image-background-remover.pages.dev"