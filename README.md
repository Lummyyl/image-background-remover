# Image Background Remover

一个用于移除图像背景的工具，支持多种图像格式和算法。

## 功能特性

- 🎨 支持多种图像格式 (PNG, JPEG, WebP, etc.)
- 🚀 高性能背景移除算法
- 🎯 精确的边缘检测
- 🔧 易于使用的 API 和 CLI
- 📱 支持批量处理
- 🎭 支持自定义背景替换

## 技术栈

- **后端**: Node.js / Python
- **图像处理**: OpenCV, PIL/Pillow
- **机器学习**: TensorFlow / PyTorch (可选)
- **Web界面**: React / Vue.js (可选)

## 安装

```bash
# 克隆仓库
git clone https://github.com/Lummyyl/image-background-remover.git
cd image-background-remover

# 安装依赖
npm install

# 或者使用 Python 版本
pip install -r requirements.txt
```

## 使用方法

### 命令行界面

```bash
# 移除单张图片的背景
node cli.js input.png output.png

# 批量处理
node cli.js --input-dir ./images --output-dir ./results

# 使用自定义背景
node cli.js input.png output.png --background white
```

### API 使用

```javascript
const { removeBackground } = require('./src/background-remover');

// 移除背景
const result = await removeBackground('input.jpg');
result.save('output.png');
```

## 项目结构

```
image-background-remover/
├── src/                 # 源代码
│   ├── algorithms/     # 背景移除算法
│   ├── utils/         # 工具函数
│   └── background-remover.js
├── cli.js             # 命令行界面
├── examples/          # 示例代码
├── tests/             # 测试文件
├── docs/              # 文档
└── README.md
```

## 贡献

欢迎提交 Pull Request！请确保：

1. 遵循代码风格指南
2. 添加适当的测试
3. 更新相关文档
4. 确保所有测试通过

## 许可证

MIT License

## 联系方式

- GitHub: [Lummyyl](https://github.com/Lummyyl)
- Email: lummyyl@example.com