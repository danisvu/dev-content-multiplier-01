const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyD7iF0wFeI2blYR2gIlwpUi6BCthsCPSFM');

async function testFullPrompt() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
  const prompt = `Generate 10 content ideas for a Content Creator in Technology. Format as JSON array with fields: title, description, rationale.

Requirements:
- Title: Catchy and specific (max 100 characters)
- Description: Detailed explanation of the content idea (max 300 characters)
- Rationale: Why this idea would work for the target audience (max 200 characters)

Example format:
[
  {
    "title": "5 Common Mistakes",
    "description": "A detailed guide",
    "rationale": "Educational content"
  }
]

Please generate exactly 10 ideas and return ONLY the JSON array:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    console.log('Raw response:');
    console.log(content);
    console.log('\n--- Length:', content.length, '---');
    
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(content);
      console.log('\n✅ Valid JSON with', parsed.length, 'items');
    } catch (e) {
      console.log('\n❌ Invalid JSON:', e.message);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testFullPrompt();
