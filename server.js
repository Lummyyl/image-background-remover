/**
 * Image Background Remover Web Server
 * 提供网页界面的图像背景移除服务
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const { removeBackground } = require('./src/background-remover');

// 加载配置
const configPath = path.join(__dirname, 'config.json');
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保上传和输出目录存在
const uploadDir = './uploads';
const outputDir = './outputs';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 限制
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|bmp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只支持 JPEG, PNG, WebP, BMP 格式的图片'));
    }
  }
});

// 主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: 移除背景
app.post('/api/remove-background', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(outputDir, `processed-${req.file.filename}`);
    
    // 获取处理参数
    const algorithm = req.body.algorithm || config.defaultAlgorithm || 'edge-detection';
    const threshold = parseFloat(req.body.threshold) || (config.defaultThreshold || 0.5);
    const feathering = parseInt(req.body.feathering) || (config.defaultFeathering || 2);
    const removeBgApiKey = req.body.removeBgApiKey || (config.removeBgApiKey || '');

    console.log(`开始处理图片: ${req.file.originalname}`);
    console.log(`算法: ${algorithm}, 阈值: ${threshold}, 羽化: ${feathering}`);

    // 移除背景
    await removeBackground(inputPath, outputPath, {
      algorithm,
      threshold,
      feathering,
      removeBgApiKey
    });

    // 生成访问URL
    const outputUrl = `/outputs/${path.basename(outputPath)}`;
    
    res.json({
      success: true,
      originalName: req.file.originalname,
      outputUrl: outputUrl,
      message: '背景移除成功！'
    });

  } catch (error) {
    console.error('处理失败:', error.message);
    res.status(500).json({ 
      error: '处理失败: ' + error.message 
    });
  }
});

// API: 获取输出图片
app.get('/outputs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(outputDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: '文件不存在' });
  }
});

// API: 获取支持的算法
app.get('/api/algorithms', (req, res) => {
  res.json({
    algorithms: [
      { id: 'edge-detection', name: '边缘检测', description: '基于边缘检测算法' },
      { id: 'color-based', name: '基于颜色', description: '基于背景颜色分析' },
      { id: 'remove-bg', name: 'Remove.bg API', description: '使用 Remove.bg 专业服务（需要 API Key）' }
    ]
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小超过限制 (10MB)' });
    }
  } else if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

// API: 测试 Remove.bg API Key
app.post('/api/test-removebg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const apiKey = req.body.apiKey || config.removeBgApiKey || '';
    if (!apiKey) {
      return res.status(400).json({ error: '没有提供 API Key' });
    }

    console.log('测试 Remove.bg API Key...');
    
    // 测试 API Key 是否有效
    const accountResponse = await axios.get('https://api.remove.bg/v1.0/account', {
      headers: {
        'X-Api-Key': apiKey
      }
    });

    // 测试图片处理
    const formData = new FormData();
    const imageBuffer = await fs.readFile(req.file.path);
    formData.append('image_file', imageBuffer, {
      filename: req.file.originalname,
      contentType: 'image/png'
    });
    formData.append('size', 'auto');
    formData.append('type', 'auto');
    formData.append('format', 'png');
    formData.append('crop', 'false');

    const processResponse = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey
        },
        responseType: 'arraybuffer'
      }
    );

    res.json({
      success: true,
      message: 'API Key 测试成功！',
      account: accountResponse.data,
      processed: true
    });

  } catch (error) {
    console.error('Remove.bg API 测试失败:', error.message);
    res.status(500).json({ 
      error: '测试失败: ' + error.message,
      details: error.response?.data?.toString() || error.message
    });
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎨 图像背景移除服务器已启动`);
  console.log(`📱 本地访问: http://localhost:${PORT}`);
  console.log(`🌐 网络访问: http://0.0.0.0:${PORT}`);
  console.log(`⚡ 支持的算法: 边缘检测, 基于颜色`);
});

module.exports = app;