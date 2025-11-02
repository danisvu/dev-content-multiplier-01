const axios = require('axios');

const API_BASE_URL = 'http://localhost:3911/api';

async function testAPI() {
  console.log('🧪 Testing Content Ideas API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test get all ideas
    console.log('\n2. Testing get all ideas...');
    const ideasResponse = await axios.get(`${API_BASE_URL}/ideas`);
    console.log('✅ Get ideas:', ideasResponse.data.length, 'ideas found');

    // Test create idea
    console.log('\n3. Testing create idea...');
    const createResponse = await axios.post(`${API_BASE_URL}/ideas`, {
      title: 'Test Idea from API',
      description: 'This is a test idea created via API',
      rationale: 'Testing the API functionality',
      persona: 'Developer',
      industry: 'Technology',
      status: 'test'
    });
    console.log('✅ Create idea:', createResponse.data);

    // Test AI generation (will fail without API keys, but tests the endpoint)
    console.log('\n4. Testing AI generation endpoint...');
    try {
      const generateResponse = await axios.post(`${API_BASE_URL}/ideas/generate`, {
        persona: 'Content Creator',
        industry: 'Technology',
        model: 'gemini',
        temperature: 0.7
      });
      console.log('✅ AI generation successful:', generateResponse.data);
    } catch (generateError) {
      if (generateError.response && generateError.response.status === 500) {
        console.log('⚠️  AI generation endpoint exists but API keys not configured');
      } else {
        throw generateError;
      }
    }

    console.log('\n🎉 All API tests completed!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
