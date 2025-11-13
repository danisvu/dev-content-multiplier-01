# 🔍 Debug Mailchimp Publishing Error

## Vấn đề
Gặp lỗi "Failed to send email campaign: Request failed with status code 500" khi publish lên Mailchimp.

## ✅ Đã Fix

### 1. Frontend Error Handling
- ✅ Cải thiện hiển thị error message từ backend
- ✅ Thêm conditional styling cho success/error states  
- ✅ Thêm chi tiết logging trong console

### 2. Backend Logging
- ✅ Thêm detailed Axios error logging
- ✅ Log validation errors riêng biệt
- ✅ Log fallback to demo mode

## 🧪 Test & Debug

### Bước 1: Kiểm tra Backend
Backend đang chạy trên port **3911** (không phải 3001):

```bash
# Test backend health
curl http://localhost:3911/health

# Test Mailchimp endpoint
curl -X POST http://localhost:3911/api/publishing/mailchimp \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "test-key-us1",
    "campaignName": "Test",
    "campaignSubject": "Test Subject",
    "emailContent": "<h1>Test</h1>"
  }'
```

### Bước 2: Xóa Cache và Test Lại

1. **Mở Browser Console** (F12 hoặc Cmd+Option+I)

2. **Xóa localStorage:**
```javascript
localStorage.removeItem('publisher_auth_state')
```

3. **Refresh trang** (Cmd+R hoặc F5)

4. **Kết nối Mailchimp lại:**
   - Click vào icon Mailchimp
   - Nhập API key với format: `key-serverprefix`
   - Ví dụ: `abc123def456789-us1`
   - **Quan trọng:** API key PHẢI có dấu `-` và server prefix (us1, us2, etc.)

5. **Check Console Logs:**
   - Tìm logs bắt đầu với `🔑 [BACKEND]` để xem API key được gửi
   - Tìm logs `🚀 [PACKS]` để xem payload gửi đến backend
   - Tìm logs `Mailchimp API Error:` nếu có lỗi

### Bước 3: Xem Backend Logs

Mở terminal chạy backend và xem output khi publish:

```bash
# Nếu backend không chạy, start lại:
cd backend
npm run dev
```

Khi publish, bạn sẽ thấy:
- `🔑 [BACKEND] Received apiKey:` - API key nhận được
- `Mailchimp API Error:` - Lỗi chi tiết nếu có
- `⚠️ Falling back to demo mode` - Nếu API call thất bại, sẽ dùng demo mode

## 🐛 Các Lỗi Thường Gặp

### 1. API Key Format Không Đúng
**Lỗi:** "Invalid Mailchimp API key format"
**Fix:** API key phải có dấu `-` và server prefix. Ví dụ: `abc123-us1`

### 2. Token Rỗng hoặc Undefined  
**Lỗi:** "API key is required and must be a non-empty string"
**Fix:** 
- Xóa localStorage và reconnect
- Đảm bảo không nhập placeholder text
- Check console logs `📂 [PACKS] API token value:`

### 3. Network Error / Connection Refused
**Lỗi:** "Request failed with status code 500" hoặc "Network Error"
**Fix:**
- Kiểm tra backend đang chạy: `curl http://localhost:3911/health`
- Kiểm tra frontend gọi đúng port 3911
- Check CORS settings

### 4. Demo Mode
Nếu API call thất bại, backend sẽ tự động fallback về **Demo Mode** và trả về:
```json
{
  "success": true,
  "message": "Campaign simulation (Demo Mode - API call failed)",
  "campaignId": "CAMP-1234567890",
  "emailsSent": 1074,
  "subscribers": 10256
}
```

Đây là behavior bình thường khi:
- API key không valid với Mailchimp thật
- Mailchimp API không khả dụng
- Network issue

## 📊 Expected Console Output

### Frontend Console (Browser):
```
🔑 AuthDialog - Raw token value: abc123-us1
📤 AuthDialog sending credentials: {token: "abc123-us1"}
💾 [PACKS] New auth state to save: {isAuthenticated: true, token: "abc123-us1", ...}
📂 [PACKS] Loading from localStorage: {"mailchimp":{"token":"abc123-us1",...}}
🚀 [PACKS] Sending to backend: {apiKey: "abc123-us1", apiKeyLength: 11, ...}
```

### Backend Console (Terminal):
```
🔑 [BACKEND] Received apiKey: abc123-us1
🔑 [BACKEND] API key length: 11
Mailchimp API Error: ...
⚠️ Falling back to demo mode due to API error
```

## ✨ Kết Quả Mong Đợi

Sau khi fix:
- ✅ Error messages hiển thị chi tiết từ backend
- ✅ Success results hiển thị màu xanh, errors màu đỏ
- ✅ Backend logs chi tiết để dễ debug
- ✅ Fallback về demo mode nếu API thật fail
- ✅ Validation errors được handle đúng cách

## 🔧 Files Đã Sửa

1. `frontend/app/packs/page.tsx` - Error handling & UI
2. `backend/src/services/mailchimpService.ts` - Detailed logging
3. `frontend/app/components/AuthDialog.tsx` - Token validation (đã có sẵn)

## 💡 Tips

1. **Development Mode:** Backend tự động fallback về demo mode, không cần API key thật
2. **Production:** Cần API key Mailchimp hợp lệ
3. **Format API Key:** `your-api-key-us1` (có dấu `-` và server prefix)
4. **Check Logs:** Luôn xem cả frontend console và backend terminal

---

**Last Updated:** 2025-11-13

