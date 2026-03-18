const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs').promises;

async function testRemoveBgAPIReal() {
  const apiKey = 'NR6A5rLUCEkNykgRyivU1MXu';
  
  console.log('=== Remove.bg API 真实图片测试 ===');
  console.log('API Key:', apiKey.substring(0, 8) + '...');
  
  try {
    // 1. 测试账户信息
    console.log('\n1. 测试账户信息...');
    const accountResponse = await axios.get('https://api.remove.bg/v1.0/account', {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    
    console.log('✅ 账户信息获取成功');
    if (accountResponse.data.data && accountResponse.data.data.email) {
      console.log('用户:', accountResponse.data.data.email);
    }
    if (accountResponse.data.data && accountResponse.data.data.credits !== undefined) {
      console.log('余额:', accountResponse.data.data.credits);
    }
    
    // 2. 使用现有的测试图片
    console.log('\n2. 使用现有测试图片...');
    
    // 检查是否有现有的图片文件
    const testImagePath = './uploads/test-image.png';
    let testImageBuffer;
    
    try {
      // 尝试读取现有图片
      testImageBuffer = await fs.readFile(testImagePath);
      console.log('✅ 使用现有测试图片，大小:', testImageBuffer.length, 'bytes');
    } catch (error) {
      // 创建一个新的测试图片
      const sharp = require('sharp');
      testImageBuffer = await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // 白色背景
        }
      })
      .png()
      .toBuffer();
      
      // 保存图片以便下次使用
      await fs.writeFile(testImagePath, testImageBuffer);
      console.log('✅ 创建新测试图片，大小:', testImageBuffer.length, 'bytes');
    }
    
    // 3. 测试图片处理
    console.log('\n3. 测试图片处理...');
    
    const formData = new FormData();
    formData.append('image_file', testImageBuffer, {
      filename: 'test.png',
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
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );
    
    console.log('✅ 图片处理成功！');
    console.log('响应大小:', processResponse.data.byteLength, 'bytes');
    
    // 保存测试结果
    await fs.writeFile('./test-result-real.png', Buffer.from(processResponse.data));
    console.log('✅ 测试结果已保存到: ./test-result-real.png');
    
    console.log('\n🎉 所有测试通过！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    
    if (error.response) {
      console.log('状态码:', error.response.status);
      console.log('响应数据:', error.response.data?.toString?.() || error.response.data);
    }
    
    console.log('\n建议:');
    console.log('1. 尝试使用更清晰的图片');
    console.log('2. 确保图片中有清晰的前景对象');
    console.log('3. 检查图片格式是否支持');
    console.log('4. 确认 API Key 余额充足');
  }
}

testRemoveBgAPIReal();