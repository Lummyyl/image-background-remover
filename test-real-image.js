const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs').promises;

async function testRealImage() {
  const apiKey = 'NR6A5rLUCEkNykgRyivU1MXu';
  
  console.log('=== 真实图片 Remove.bg API 测试 ===');
  
  try {
    // 读取真实测试图片
    const testImageBuffer = await fs.readFile('./uploads/real-test.png');
    console.log('✅ 读取测试图片成功，大小:', testImageBuffer.length, 'bytes');
    
    // 创建 FormData
    const formData = new FormData();
    formData.append('image_file', testImageBuffer, {
      filename: 'real-test.png',
      contentType: 'image/png'
    });
    formData.append('size', 'auto');
    formData.append('type', 'auto');
    formData.append('format', 'png');
    formData.append('crop', 'false');
    
    console.log('✅ FormData 创建成功');
    
    // 调用 Remove.bg API
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
    
    // 保存处理结果
    await fs.writeFile('./uploads/real-result.png', Buffer.from(processResponse.data));
    console.log('✅ 处理结果已保存到: ./uploads/real-result.png');
    
    console.log('\n🎉 真实图片测试成功！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    
    if (error.response) {
      console.log('状态码:', error.response.status);
      console.log('响应数据:', error.response.data?.toString?.() || error.response.data);
    }
    
    console.log('\n可能的原因:');
    console.log('1. 图片中没有清晰的前景对象');
    console.log('2. 图片质量问题');
    console.log('3. API Key 积分不足');
    console.log('4. 网络连接问题');
  }
}

testRealImage();