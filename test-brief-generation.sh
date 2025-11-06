#!/bin/bash

# Test Script: Generate Brief from Idea
# Usage: ./test-brief-generation.sh [idea_id] [model]

API_BASE="http://localhost:3911/api"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${CYAN}🤖 Test: Generate Brief from Idea${NC}"
echo -e "${BLUE}========================================${NC}"

# Get parameters
IDEA_ID=${1:-2}
MODEL=${2:-"gemini"}

echo -e "\n${YELLOW}📋 Configuration:${NC}"
echo -e "   Idea ID: ${IDEA_ID}"
echo -e "   Model: ${MODEL}"

# Step 1: Get the idea
echo -e "\n${CYAN}📖 Step 1: Fetching idea #${IDEA_ID}...${NC}"
IDEA=$(curl -s "${API_BASE}/ideas/${IDEA_ID}")

if [ -z "$IDEA" ] || [[ "$IDEA" == *"error"* ]]; then
    echo -e "${RED}❌ Error: Idea not found!${NC}"
    exit 1
fi

IDEA_TITLE=$(echo $IDEA | grep -o '"title":"[^"]*"' | head -1 | sed 's/"title":"\(.*\)"/\1/')
echo -e "${GREEN}✅ Found idea: ${IDEA_TITLE}${NC}"

# Step 2: Generate brief
echo -e "\n${CYAN}🤖 Step 2: Generating brief using ${MODEL}...${NC}"
echo -e "${YELLOW}⏳ This may take 10-30 seconds...${NC}"

RESPONSE=$(curl -X POST "${API_BASE}/briefs/generate" \
  -H "Content-Type: application/json" \
  -d "{
    \"idea_id\": ${IDEA_ID},
    \"model\": \"${MODEL}\",
    \"temperature\": 0.7,
    \"additional_context\": \"Tập trung vào nội dung thực tế và dễ hiểu\"
  }" \
  2>/dev/null)

# Check response
if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
    echo -e "\n${GREEN}✅ Brief generated successfully!${NC}"
    echo -e "\n${BLUE}📄 Generated Brief:${NC}"
    echo "$RESPONSE" | json_pp 2>/dev/null || echo "$RESPONSE" | python -m json.tool 2>/dev/null || echo "$RESPONSE"
    
    # Extract brief ID
    BRIEF_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')
    
    if [ ! -z "$BRIEF_ID" ]; then
        echo -e "\n${CYAN}🔍 Step 3: Verifying brief in database...${NC}"
        curl -s "${API_BASE}/briefs/${BRIEF_ID}" | json_pp 2>/dev/null || curl -s "${API_BASE}/briefs/${BRIEF_ID}"
        echo -e "\n${GREEN}✅ Brief verified in database!${NC}"
    fi
    
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${GREEN}🎉 TEST COMPLETED SUCCESSFULLY!${NC}"
    echo -e "${BLUE}========================================${NC}"
else
    echo -e "\n${RED}❌ Error generating brief:${NC}"
    echo "$RESPONSE" | json_pp 2>/dev/null || echo "$RESPONSE" | python -m json.tool 2>/dev/null || echo "$RESPONSE"
    
    # Check for common errors
    if [[ "$RESPONSE" == *"429"* ]] || [[ "$RESPONSE" == *"Too Many Requests"* ]]; then
        echo -e "\n${YELLOW}💡 Tip: API rate limit reached. Try:${NC}"
        echo -e "   1. Wait a few minutes"
        echo -e "   2. Use different model: ./test-brief-generation.sh ${IDEA_ID} deepseek"
    fi
    
    if [[ "$RESPONSE" == *"401"* ]] || [[ "$RESPONSE" == *"invalid"* ]]; then
        echo -e "\n${YELLOW}💡 Tip: API key invalid. Check:${NC}"
        echo -e "   1. backend/.env has correct GEMINI_API_KEY or DEEPSEEK_API_KEY"
        echo -e "   2. Restart backend server after updating .env"
    fi
    
    exit 1
fi

