#!/bin/bash

# Test script to verify backend health on Vercel
# Usage: ./test-vercel-backend.sh https://your-backend-url

BACKEND_URL="${1:-https://dev-content-multiplier-01-backend.vercel.app}"

echo "🔍 Testing Backend Health Check..."
echo "Backend URL: $BACKEND_URL"
echo ""

# Test health endpoint
echo "📡 Testing /health endpoint..."
curl -v "$BACKEND_URL/health" 2>&1 | head -30

echo ""
echo ""
echo "📡 Testing /api/ideas endpoint (with timeout)..."
timeout 10 curl -v "$BACKEND_URL/api/ideas" 2>&1 | head -30

echo ""
echo "✅ Tests completed!"
echo ""
echo "Tips:"
echo "- If you see 'Connection refused' or 'Could not resolve host', the backend isn't deployed yet"
echo "- If you see HTTPS errors, try with http:// instead"
echo "- Check Vercel dashboard for deployment status"
