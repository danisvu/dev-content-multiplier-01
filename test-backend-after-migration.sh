#!/bin/bash

BACKEND_URL="https://dev-content-multiplier-01-backend.vercel.app"

echo "🧪 Testing backend sau khi tạo tables..."
echo ""

echo "1️⃣ Test /health endpoint:"
curl -s "$BACKEND_URL/health" | jq '.' 2>/dev/null || curl -s "$BACKEND_URL/health"
echo ""
echo ""

echo "2️⃣ Test /api/ideas endpoint:"
curl -s "$BACKEND_URL/api/ideas" | jq '.' 2>/dev/null || curl -s "$BACKEND_URL/api/ideas"
echo ""
echo ""

echo "3️⃣ Test /api/briefs endpoint:"
curl -s "$BACKEND_URL/api/briefs" | jq '.' 2>/dev/null || curl -s "$BACKEND_URL/api/briefs"
echo ""
echo ""

echo "✅ Nếu thấy [] (mảng rỗng) = SUCCESS!"
echo "❌ Nếu thấy lỗi 500 = Còn vấn đề"

