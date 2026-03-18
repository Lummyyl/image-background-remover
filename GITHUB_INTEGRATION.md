# Cloudflare Pages GitHub 集成指南

## 已完成的配置

### 1. Cloudflare 配置文件
- ✅ `wrangler.toml` - Cloudflare Pages 配置
- ✅ `.env.production` - 生产环境变量
- ✅ `.env.development` - 开发环境变量
- ✅ `next.config.js` - Next.js 配置

### 2. GitHub Actions 配置
- ✅ `.github/workflows/deploy.yml` - 自动部署工作流

### 3. Next.js 应用结构
- ✅ `pages/index.js` - 主页面
- ✅ `pages/api/` - API 路由
- ✅ `styles/globals.css` - 全局样式
- ✅ `_app.js` - 应用组件

## GitHub 集成步骤

### 步骤 1: 在 Cloudflare 设置 GitHub 集成

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages > Create project
3. 选择 "Connect to Git"
4. 选择 GitHub 仓库: `Lummyyl/image-background-remover`
5. 授权 Cloudflare 访问你的 GitHub 仓库

### 步骤 2: 配置 GitHub Secrets

在 GitHub 仓库中设置以下 secrets:

1. 进入仓库 Settings > Secrets and variables > Actions
2. 点击 "New repository secret"
3. 添加以下 secrets:

```bash
CLOUDFLARE_ACCOUNT_ID=5ba5d00473f4b1a1a48d419ba30785c4
CLOUDFLARE_API_TOKEN=ddQ0cW2u88QArvAIGm4bTFO2ldnNzwJHIxqrF4QS
```

### 步骤 3: 推送代码触发部署

```bash
git add .
git commit -m "feat: 添加 Cloudflare Pages GitHub 集成"
git push origin main
```

### 步骤 4: 验证部署

1. 等待 GitHub Actions 完成
2. 查看部署状态: https://github.com/Lummyyl/image-background-remover/actions
3. 访问 Cloudflare Pages URL: https://image-background-remover.pages.dev

## 功能特性

### 支持的算法
- 🎨 边缘检测
- 🎯 基于颜色
- 🚀 Remove.bg API

### 技术栈
- Next.js 14
- Cloudflare Pages
- GitHub Actions
- Express.js API
- Sharp 图像处理

### 部署特性
- ✅ 自动部署 (main 分支)
- ✅ 预览部署 (PR)
- ✅ 环境变量管理
- ✅ CDN 加速
- ✅ HTTPS 支持

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 部署到 Cloudflare Pages
npm run deploy
```

## 故障排除

### 常见问题

1. **部署失败**
   - 检查 GitHub Secrets 是否正确设置
   - 确认 Cloudflare API Token 权限
   - 查看 GitHub Actions 日志

2. **图片处理失败**
   - 检查 Remove.bg API Key 是否有效
   - 确认图片格式支持
   - 查看服务器日志

3. **页面无法访问**
   - 检查 Cloudflare Pages 状态
   - 确认域名配置
   - 验证 SSL 证书

### 调试命令

```bash
# 检查 Cloudflare 配置
npx wrangler whoami

# 本地测试
npm run dev

# 构建检查
npm run build
```