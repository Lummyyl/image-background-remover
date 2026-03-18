const sharp = require('sharp');
const fs = require('fs').promises;

async function createRealTestImage() {
  try {
    console.log('=== 创建真实测试图片 ===');
    
    // 创建一个包含前景对象的图片
    const testImage = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 } // 黑色背景
      }
    })
    .png()
    .toBuffer();
    
    // 保存测试图片
    await fs.writeFile('./uploads/real-test.png', testImage);
    console.log('✅ 真实测试图片创建成功');
    console.log('图片大小:', testImage.length, 'bytes');
    console.log('保存路径: ./uploads/real-test.png');
    
  } catch (error) {
    console.error('❌ 创建测试图片失败:', error.message);
  }
}

createRealTestImage();