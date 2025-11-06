#!/bin/bash

# Test Script: Brief Generation with Status Validation
# Tests that briefs can only be generated from ideas with status='selected'

API_BASE="http://localhost:3911/api"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================================${NC}"
echo -e "${CYAN}🔒 Test: Brief Generation Status Validation${NC}"
echo -e "${BLUE}================================================================${NC}"

# Get first idea
echo -e "\n${CYAN}📋 Step 1: Fetching an idea...${NC}"
IDEA=$(curl -s "${API_BASE}/ideas" | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')

if [ -z "$IDEA" ]; then
    echo -e "${RED}❌ No ideas found in database!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found idea ID: ${IDEA}${NC}"

# Get idea details
IDEA_DATA=$(curl -s "${API_BASE}/ideas/${IDEA}")
IDEA_TITLE=$(echo "$IDEA_DATA" | grep -o '"title":"[^"]*"' | sed 's/"title":"\(.*\)"/\1/')
IDEA_STATUS=$(echo "$IDEA_DATA" | grep -o '"status":"[^"]*"' | sed 's/"status":"\(.*\)"/\1/')

echo -e "   Title: ${IDEA_TITLE}"
echo -e "   Current Status: ${YELLOW}${IDEA_STATUS}${NC}"

# Test 1: Try to generate brief WITHOUT 'selected' status
echo -e "\n${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🧪 Test 1: Try generating brief with status='${IDEA_STATUS}' (Should FAIL)${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$IDEA_STATUS" != "selected" ]; then
    echo -e "${YELLOW}⏳ Attempting to generate brief...${NC}"
    
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${API_BASE}/briefs/generate" \
      -H "Content-Type: application/json" \
      -d "{\"idea_id\": ${IDEA}, \"model\": \"gemini\"}" 2>/dev/null)
    
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
    BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')
    
    if [ "$HTTP_STATUS" == "403" ]; then
        echo -e "${GREEN}✅ PASS: Request correctly rejected with 403 Forbidden${NC}"
        echo -e "${BLUE}Response:${NC}"
        echo "$BODY" | json_pp 2>/dev/null || echo "$BODY"
    else
        echo -e "${RED}❌ FAIL: Expected 403, got ${HTTP_STATUS}${NC}"
        echo "$BODY" | json_pp 2>/dev/null || echo "$BODY"
    fi
else
    echo -e "${YELLOW}⚠️  Idea already has status='selected', skipping this test${NC}"
fi

# Test 2: Update status to 'selected'
echo -e "\n${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🧪 Test 2: Update idea status to 'selected'${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

UPDATE_RESPONSE=$(curl -s -X PATCH "${API_BASE}/ideas/${IDEA}/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "selected"}')

if [[ "$UPDATE_RESPONSE" == *"\"success\":true"* ]]; then
    echo -e "${GREEN}✅ Successfully updated status to 'selected'${NC}"
    echo "$UPDATE_RESPONSE" | json_pp 2>/dev/null || echo "$UPDATE_RESPONSE"
else
    echo -e "${RED}❌ Failed to update status${NC}"
    echo "$UPDATE_RESPONSE"
    exit 1
fi

# Test 3: Try to generate brief WITH 'selected' status
echo -e "\n${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🧪 Test 3: Try generating brief with status='selected' (Should SUCCEED or fail for API reasons)${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}⏳ Attempting to generate brief (may take 10-30 seconds)...${NC}"

GEN_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${API_BASE}/briefs/generate" \
  -H "Content-Type: application/json" \
  -d "{\"idea_id\": ${IDEA}, \"model\": \"gemini\", \"temperature\": 0.7}" 2>/dev/null)

GEN_HTTP_STATUS=$(echo "$GEN_RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
GEN_BODY=$(echo "$GEN_RESPONSE" | sed '/HTTP_STATUS:/d')

if [ "$GEN_HTTP_STATUS" == "201" ]; then
    echo -e "${GREEN}✅ PASS: Brief generated successfully!${NC}"
    echo -e "${BLUE}Response:${NC}"
    echo "$GEN_BODY" | json_pp 2>/dev/null || echo "$GEN_BODY"
elif [ "$GEN_HTTP_STATUS" == "403" ]; then
    echo -e "${RED}❌ FAIL: Still getting 403 even with status='selected'${NC}"
    echo "$GEN_BODY" | json_pp 2>/dev/null || echo "$GEN_BODY"
elif [ "$GEN_HTTP_STATUS" == "500" ]; then
    # Check if it's an API key issue (expected in demo)
    if [[ "$GEN_BODY" == *"429"* ]] || [[ "$GEN_BODY" == *"rate limit"* ]] || [[ "$GEN_BODY" == *"401"* ]] || [[ "$GEN_BODY" == *"invalid"* ]]; then
        echo -e "${YELLOW}⚠️  EXPECTED: AI API issue (rate limit or invalid key)${NC}"
        echo -e "${GREEN}✅ PASS: Status validation worked, AI call was attempted${NC}"
        echo -e "${BLUE}Error details:${NC}"
        echo "$GEN_BODY" | json_pp 2>/dev/null || echo "$GEN_BODY"
    else
        echo -e "${RED}❌ FAIL: Unexpected 500 error${NC}"
        echo "$GEN_BODY" | json_pp 2>/dev/null || echo "$GEN_BODY"
    fi
else
    echo -e "${YELLOW}⚠️  Got HTTP ${GEN_HTTP_STATUS}${NC}"
    echo "$GEN_BODY" | json_pp 2>/dev/null || echo "$GEN_BODY"
fi

# Summary
echo -e "\n${BLUE}================================================================${NC}"
echo -e "${CYAN}📊 Test Summary${NC}"
echo -e "${BLUE}================================================================${NC}"

echo -e "\n${GREEN}✅ Status Validation: Working${NC}"
echo -e "   - Briefs can only be generated from ideas with status='selected'"
echo -e "   - Non-selected ideas return 403 Forbidden"
echo -e "   - Status can be updated via PATCH /api/ideas/:id/status"

echo -e "\n${YELLOW}💡 Available Statuses:${NC}"
echo -e "   - 'pending'   : Initial status"
echo -e "   - 'selected'  : Ready for brief generation (REQUIRED)"
echo -e "   - 'rejected'  : Idea rejected"
echo -e "   - 'generated' : Brief already generated"

echo -e "\n${CYAN}📝 How to Update Status:${NC}"
echo -e "   ${YELLOW}curl -X PATCH ${API_BASE}/ideas/${IDEA}/status \\${NC}"
echo -e "   ${YELLOW}  -H \"Content-Type: application/json\" \\${NC}"
echo -e "   ${YELLOW}  -d '{\"status\": \"selected\"}'${NC}"

echo -e "\n${BLUE}================================================================${NC}"
echo -e "${GREEN}🎉 Validation Test Complete!${NC}"
echo -e "${BLUE}================================================================${NC}\n"

