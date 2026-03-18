const axios = require('axios');
const fs = require('fs').promises;
const FormData = require('form-data');

async function testRemoveBgAPI() {
  const apiKey = 'NR6A5rLUCEkNykgRyivU1MXu';
  
  console.log('=== Remove.bg API 测试 ===');
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
    console.log('用户:', accountResponse.data.data.email);
    console.log('余额:', accountResponse.data.data.credits);
    
    // 2. 测试图片处理
    console.log('\n2. 测试图片处理...');
    
    // 创建一个测试图片 (1x1 像素的PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x49, 0x45,
      0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const formData = new FormData();
    formData.append('image_file', testImageBuffer, {
      filename: 'test.png',
      contentType: 'image/png'
    });
    
    const processResponse = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          'X-Api-Key': apiKey,
          ...formData.getHeaders()
        },
        params: {
          size: 'auto',
          type: 'auto',
          format: 'png'
        },
        responseType: 'arraybuffer'
      }
    );
    
    console.log('✅ 图片处理成功');
    console.log('响应大小:', processResponse.data.byteLength, 'bytes');
    
    // 保存测试结果
    await fs.writeFile('./test-result.png', Buffer.from(processResponse.data));
    console.log('✅ 测试结果已保存到: ./test-result.png');
    
    console.log('\n🎉 所有测试通过！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    
    if (error.response) {
      console.log('状态码:', error.response.status);
      console.log('响应数据:', error.response.data.toString());
    }
    
    console.log('\n可能的原因:');
    console.log('1. API Key 无效或已过期');
    console.log('2. API Key 余额不足');
    console.log('3. API Key 格式不正确');
    console.log('4. 网络连接问题');
  }
}

testRemoveBgAPI();