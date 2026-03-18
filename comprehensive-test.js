const axios = require('axios');

async function testAPIKeyWithRealEndpoint() {
  const apiKey = 'NR6A5rLUCEkNykgRyivU1MXu';
  
  console.log('=== 完整的 API Key 测试 ===');
  
  try {
    // 1. 测试基本账户信息
    console.log('\n1. 测试账户信息...');
    const accountResponse = await axios.get('https://api.remove.bg/v1.0/account', {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    
    console.log('✅ 账户信息获取成功');
    console.log('用户属性:', JSON.stringify(accountResponse.data.data.attributes, null, 2));
    
    // 2. 测试 API Key 权限
    console.log('\n2. 测试 API Key 权限...');
    const permissionsResponse = await axios.get('https://api.remove.bg/v1.0/api-key', {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    
    console.log('✅ API Key 权限获取成功');
    console.log('权限信息:', JSON.stringify(permissionsResponse.data, null, 2));
    
    // 3. 检查积分状态
    console.log('\n3. 检查积分状态...');
    const creditsResponse = await axios.get('https://api.remove.bg/v1.0/subscription', {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    
    console.log('✅ 订阅信息获取成功');
    console.log('订阅信息:', JSON.stringify(creditsResponse.data, null, 2));
    
    console.log('\n🎉 API Key 完全正常！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    
    if (error.response) {
      console.log('状态码:', error.response.status);
      console.log('响应数据:', error.response.data?.toString?.() || error.response.data);
    }
    
    console.log('\n可能的问题:');
    console.log('1. API Key 权限不足');
    console.log('2. API Key 已过期');
    console.log('3. API Key 被禁用');
    console.log('4. API Key 不存在');
  }
}

testAPIKeyWithRealEndpoint();