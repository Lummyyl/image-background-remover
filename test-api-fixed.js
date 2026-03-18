const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs').promises;

async function testRemoveBgAPIFixed() {
  const apiKey = 'NR6A5rLUCEkNykgRyivU1MXu';
  
  console.log('=== Remove.bg API 修复后测试 ===');
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
    
    // 2. 创建一个实际的测试图片
    console.log('\n2. 创建测试图片...');
    const sharp = require('sharp');
    
    // 创建一个 100x100 的测试图片
    const testImageBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 } // 红色背景
      }
    })
    .png()
    .toBuffer();
    
    console.log('✅ 测试图片创建成功，大小:', testImageBuffer.length, 'bytes');
    
    // 3. 测试图片处理（使用正确的 FormData 格式）
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
    
    console.log('✅ FormData 创建成功');
    
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
    await fs.writeFile('./test-result-fixed.png', Buffer.from(processResponse.data));
    console.log('✅ 测试结果已保存到: ./test-result-fixed.png');
    
    console.log('\n🎉 所有测试通过！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    
    if (error.response) {
      console.log('状态码:', error.response.status);
      console.log('响应数据:', error.response.data?.toString?.() || error.response.data);
    }
    
    console.log('\n可能的原因:');
    console.log('1. API Key 无效或已过期');
    console.log('2. API Key 余额不足');
    console.log('3. API Key 格式不正确');
    console.log('4. 网络连接问题');
    console.log('5. 图片格式不支持');
  }
}

testRemoveBgAPIFixed();