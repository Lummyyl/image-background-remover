/**
 * 基本使用示例
 */

const path = require('path');
const { removeBackground } = require('../src/background-remover');

async function basicExample() {
  console.log('🎨 基本使用示例');
  
  try {
    // 示例图片路径（需要用户提供实际的图片）
    const inputPath = './sample-images/input.jpg';
    const outputPath = './sample-images/output.png';
    
    // 检查输入文件是否存在
    const fs = require('fs');
    if (!fs.existsSync(inputPath)) {
      console.log('❌ 示例图片不存在，请准备一张测试图片');
      console.log(`   路径: ${inputPath}`);
      return;
    }
    
    // 移除背景
    console.log('开始处理...');
    await removeBackground(inputPath, outputPath, {
      algorithm: 'edge-detection',
      threshold: 0.5,
      feathering: 2
    });
    
    console.log('✅ 处理完成!');
    console.log(`输出文件: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ 处理失败:', error.message);
  }
}

// 运行示例
if (require.main === module) {
  basicExample();
}

module.exports = { basicExample };