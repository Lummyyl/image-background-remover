const axios = require('axios');

async function checkAPIKey() {
  const apiKey = 'NR6A5rLUCEkNykgRyivU1MXu';
  
  try {
    console.log('=== 检查 API Key 状态 ===');
    
    // 检查账户信息
    const accountResponse = await axios.get('https://api.remove.bg/v1.0/account', {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    
    console.log('✅ API Key 有效');
    console.log('账户信息:', JSON.stringify(accountResponse.data, null, 2));
    
    // 检查 API Key 权限
    const creditsResponse = await axios.get('https://api.remove.bg/v1.0/credits', {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    
    console.log('✅ 余额查询成功');
    console.log('余额信息:', JSON.stringify(creditsResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
    if (error.response) {
      console.log('状态码:', error.response.status);
      console.log('响应数据:', error.response.data?.toString?.() || error.response.data);
    }
  }
}

checkAPIKey();