# 🚀 图像背景移除工具 - 完整部署指南

## 📋 已完成配置

### ✅ Cloudflare 配置
- **Account ID**: `5ba5d00473f4b1a1a48d419ba30785c4`
- **API Token**: `ddQ0cW2u88QArvAIGm4bTFO2ldnNzwJHIxqrF4QS`
- **项目名称**: `image-background-remover`

### ✅ 技术栈
- **前端**: Next.js 14 + React
- **后端**: Express.js API
- **部署**: Cloudflare Pages
- **CI/CD**: GitHub Actions
- **图像处理**: Sharp + Remove.bg API

### ✅ 功能特性
- 🎨 多种背景移除算法
- 🚀 Remove.bg API 集成
- 📱 响应式设计
- ⚡ CDN 加速
- 🔒 HTTPS 支持

## 🚀 部署步骤

### 步骤 1: GitHub 仓库设置

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 图像背景移除工具"
   git remote add origin https://github.com/Lummyyl/image-background-remover.git
   git push -u origin main
   ```

2. **配置 GitHub Secrets**
   - 进入仓库 Settings > Secrets and variables > Actions
   - 添加以下 secrets:
     ```
     CLOUDFLARE_ACCOUNT_ID=5ba5d00473f4b1a1a48d419ba30785c4
     CLOUDFLARE_API_TOKEN=ddQ0cW2u88QArvAIGm4bTFO2ldnNzwJHIxqrF4QS
     ```

### 步骤 2: Cloudflare 设置

1. **登录 Cloudflare Dashboard**
   - 访问: https://dash.cloudflare.com/
   - 选择 Pages > Create project

2. **连接 GitHub 仓库**
   - 选择 "Connect to Git"
   - 选择 `Lummyyl/image-background-remover` 仓库
   - 授权 Cloudflare 访问

3. **配置项目**
   - **Project name**: `image-background-remover`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

### 步骤 3: 部署应用

#### 方法 1: 自动部署 (推荐)
```bash
# 推送代码触发自动部署
git add .
git commit -m "feat: 添加 Cloudflare Pages GitHub 集成"
git push origin main
```

#### 方法 2: 手动部署
```bash
# 设置环境变量
export CLOUDFLARE_ACCOUNT_ID=5ba5d00473f4b1a1a48d419ba30785c4
export CLOUDFLARE_API_TOKEN=ddQ0cW2u88QArvAIGm4bTFO2ldnNzwJHIxqrF4QS

# 运行部署脚本
./deploy.sh
```

### 步骤 4: 验证部署

1. **检查部署状态**
   - GitHub Actions: https://github.com/Lummyyl/image-background-remover/actions
   - Cloudflare Pages: https://dash.cloudflare.com/pages

2. **访问应用**
   - 主站: https://image-background-remover.pages.dev
   - API 端点: https://image-background-remover.pages.dev/api/algorithms

## 🔧 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 本地测试
```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 📊 监控和维护

### 性能监控
- Cloudflare Analytics
- GitHub Actions 日志
- 错误监控

### 更新部署
```bash
# 提交更改自动触发重新部署
git add .
git commit -m "更新功能"
git push origin main
```

### 回滚版本
- 在 Cloudflare Pages Dashboard 中回滚到之前的版本

## 🐛 故障排除

### 常见问题

1. **部署失败**
   ```bash
   # 检查 Cloudflare 配置
   npx wrangler whoami
   
   # 检查 API Token 权限
   npx wrangler pages project list
   ```

2. **图片处理失败**
   ```bash
   # 检查 Remove.bg API Key
   node check-api-key.js
   
   # 测试 API 调用
   node test-real-image.js
   ```

3. **页面无法访问**
   - 检查 Cloudflare Pages 状态
   - 确认域名配置
   - 验证 SSL 证书

### 调试工具

```bash
# 本地开发调试
npm run dev

# 构建检查
npm run build

# API 测试
curl http://localhost:3000/api/algorithms
```

## 🎯 使用说明

### 功能特性
1. **边缘检测算法** - 基于图像边缘检测
2. **基于颜色算法** - 基于背景颜色分析
3. **Remove.bg API** - 使用专业 AI 服务

### 使用方法
1. 访问部署的网站
2. 选择图片文件
3. 选择处理算法
4. 调整参数（可选）
5. 点击开始处理
6. 下载处理结果

### 支持格式
- 输入: PNG, JPEG, WebP, BMP
- 输出: PNG
- 文件大小: 最大 10MB

## 📈 性能优化

### CDN 加速
- Cloudflare CDN 全球加速
- 图片缓存优化
- 压缩传输

### 成本优化
- 免费额度: Remove.bg API 50次免费调用
- Cloudflare Pages 免费额度
- 自动扩展

### 安全性
- HTTPS 加密
- API Key 安全存储
- 文件类型验证

## 🎉 完成！

现在你的图像背景移除工具已经完全配置好，可以部署到 Cloudflare Pages 并通过 GitHub 自动部署。

**访问地址**: https://image-background-remover.pages.dev

**功能特性**:
- 🎨 多种背景移除算法
- 🚀 Remove.bg AI 服务
- 📱 响应式设计
- ⚡ 全球 CDN 加速
- 🔒 安全可靠