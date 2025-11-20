#!/bin/bash

echo "🔍 Đang kiểm tra các URL backend có thể có..."
echo ""

# Danh sách các URL có thể có
URLS=(
  "https://dev-content-multiplier-01.vercel.app"
  "https://dev-content-multiplier-01-backend.vercel.app"
  "https://dev-content-multiplier-01-api.vercel.app"
)

for URL in "${URLS[@]}"
do
  echo "Testing: $URL/health"
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/health" 2>&1)
  
  if [ "$RESPONSE" = "200" ]; then
    echo "✅ FOUND! Backend đang chạy tại: $URL"
    echo ""
    echo "📋 Health check response:"
    curl -s "$URL/health" | jq '.' 2>/dev/null || curl -s "$URL/health"
    echo ""
    echo ""
    echo "🎯 Dùng URL này cho frontend:"
    echo "NEXT_PUBLIC_API_URL=$URL"
    echo ""
    break
  else
    echo "❌ Not found (HTTP $RESPONSE)"
  fi
  echo ""
done

echo ""
echo "📝 Nếu không tìm thấy, có thể:"
echo "1. Backend chưa deploy"
echo "2. Backend có tên khác"
echo "3. Backend đang ở private/domain khác"
echo ""
echo "Hãy check Vercel Dashboard: https://vercel.com/dashboard"

