#!/usr/bin/env node

/**
 * Test Script: Generate Brief from Idea using AI
 * 
 * This script demonstrates how to:
 * 1. Get an existing idea from the database
 * 2. Use AI to generate a detailed content brief from that idea
 * 3. Save the brief to the database
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3911/api';

// Color formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

async function testGenerateBrief() {
  try {
    log(colors.bright + colors.blue, '\n🚀 TEST: Generate Brief from Idea using AI\n');
    log(colors.bright + colors.blue, '='.repeat(60));

    // Step 1: Get list of existing ideas
    log(colors.cyan, '\n📋 Step 1: Fetching existing ideas...');
    const ideasResponse = await axios.get(`${API_BASE_URL}/ideas`);
    const ideas = ideasResponse.data;

    if (ideas.length === 0) {
      log(colors.red, '❌ No ideas found in database. Please create an idea first.');
      return;
    }

    log(colors.green, `✅ Found ${ideas.length} ideas`);
    
    // Display available ideas
    console.log('\nAvailable ideas:');
    ideas.slice(0, 5).forEach((idea, index) => {
      console.log(`  ${index + 1}. [ID: ${idea.id}] ${idea.title}`);
      console.log(`     ${idea.description?.substring(0, 80) || 'No description'}...`);
    });

    // Use the first idea for testing
    const selectedIdea = ideas[0];
    log(colors.yellow, `\n🎯 Selected Idea: [ID: ${selectedIdea.id}] "${selectedIdea.title}"`);
    console.log(`   Persona: ${selectedIdea.persona || 'N/A'}`);
    console.log(`   Industry: ${selectedIdea.industry || 'N/A'}`);
    console.log(`   Description: ${selectedIdea.description?.substring(0, 150) || 'N/A'}...`);

    // Step 2: Generate brief using AI
    log(colors.cyan, '\n🤖 Step 2: Generating brief using AI...');
    log(colors.yellow, 'This may take 10-30 seconds...');

    const generateRequest = {
      idea_id: selectedIdea.id,
      model: 'gemini', // or 'deepseek'
      temperature: 0.7,
      additional_context: 'Focus on actionable tips and real-world examples'
    };

    const startTime = Date.now();
    const generateResponse = await axios.post(
      `${API_BASE_URL}/briefs/generate`,
      generateRequest,
      { timeout: 60000 }
    );
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (generateResponse.data.success) {
      const brief = generateResponse.data.brief;
      
      log(colors.green, `\n✅ Brief generated successfully in ${duration}s!`);
      log(colors.bright + colors.green, '\n📄 GENERATED BRIEF:\n');
      
      console.log('─'.repeat(60));
      console.log(colors.bright, `Title: ${brief.title}`, colors.reset);
      console.log(`ID: ${brief.id} | Status: ${brief.status}`);
      console.log('─'.repeat(60));
      
      console.log(colors.bright + '\n🎯 Target Audience:', colors.reset);
      console.log(`   ${brief.target_audience}`);
      
      console.log(colors.bright + '\n📝 Content Plan:', colors.reset);
      console.log(`   ${brief.content_plan.substring(0, 300)}...`);
      
      console.log(colors.bright + '\n💡 Key Points:', colors.reset);
      brief.key_points.forEach((point, idx) => {
        console.log(`   ${idx + 1}. ${point}`);
      });
      
      console.log(colors.bright + '\n🎨 Tone:', colors.reset, brief.tone);
      console.log(colors.bright + '📊 Word Count:', colors.reset, brief.word_count);
      
      console.log(colors.bright + '\n🔑 Keywords:', colors.reset);
      console.log(`   ${brief.keywords.join(', ')}`);
      
      console.log('\n' + '─'.repeat(60));
      
      // Step 3: Verify brief in database
      log(colors.cyan, '\n🔍 Step 3: Verifying brief in database...');
      const verifyResponse = await axios.get(`${API_BASE_URL}/briefs/${brief.id}`);
      
      if (verifyResponse.data) {
        log(colors.green, '✅ Brief successfully saved and verified in database!');
        console.log(`   Database ID: ${verifyResponse.data.id}`);
        console.log(`   Created at: ${new Date(verifyResponse.data.created_at).toLocaleString()}`);
      }

      // Summary
      log(colors.bright + colors.blue, '\n' + '='.repeat(60));
      log(colors.bright + colors.green, '🎉 TEST COMPLETED SUCCESSFULLY!');
      log(colors.bright + colors.blue, '='.repeat(60));
      
      console.log('\n📊 Summary:');
      console.log(`   ✓ Idea selected: "${selectedIdea.title}"`);
      console.log(`   ✓ Brief generated in ${duration}s`);
      console.log(`   ✓ Brief ID: ${brief.id}`);
      console.log(`   ✓ Status: ${brief.status}`);
      console.log(`   ✓ AI Model: ${generateRequest.model}`);

    } else {
      log(colors.red, '❌ Failed to generate brief');
      console.error('Response:', generateResponse.data);
    }

  } catch (error) {
    log(colors.red, '\n❌ ERROR:', error.message);
    
    if (error.response) {
      console.error('\nServer Response:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      log(colors.red, '⚠️  No response from server. Is the backend running on port 3911?');
    }
  }
}

// Run test
testGenerateBrief();

