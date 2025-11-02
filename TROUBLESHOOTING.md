# Hướng Dẫn Khắc Phục Sự Cố - Content Ideas Manager

## ⚠️ Vấn Đề: "Không thể kết nối đến server"

Khi nhấn nút **"Generate Ideas"** nhưng gặp lỗi "Không thể kết nối đến server", hãy theo các bước dưới đây.

---

## 🔍 Chẩn Đoán Nhanh

Chạy script chẩn đoán để kiểm tra trạng thái hệ thống:

```bash
node diagnose-connection.js
```

Script sẽ kiểm tra:
- ✅ Cấu hình PORT trong `.env`
- ✅ Port có đang được sử dụng (server chạy hay không)
- ✅ Health check endpoint
- ✅ Kết nối database

---

## 🛠️ Khắc Phục Từng Vấn Đề

### 1️⃣ Backend Không Khởi Động

**Triệu chứng:**
- Script chẩn đoán báo: "Port 3911 không có gì lắng nghe"
- Không thể truy cập `http://localhost:3911/health`

**Cách Fix:**

**Bước 1: Cài đặt dependencies**
```bash
cd backend
npm install
```

**Bước 2: Khởi động Database**
```bash
cd ..
docker-compose up -d
```

**Bước 3: Khởi động Backend Server**
```bash
cd backend
npm run dev
```

Bạn sẽ thấy:
```
Server listening on http://localhost:3911
```

---

### 2️⃣ Model Gemini Không Hợp Lệ

**Triệu chứng:**
- Response error: `"models/gemini-1.5-pro is not found"`

**Cách Fix:** ✅ **ĐÃ SỬA**
- Đã cập nhật từ `gemini-1.5-pro` → `gemini-2.0-flash`
- Restart backend để áp dụng thay đổi

---

### 3️⃣ Database Schema Không Khớp

**Triệu chứng:**
- Response error: `"column "rationale" of relation "ideas" does not exist"`

**Cách Fix:** ✅ **ĐÃ SỬA**

Nếu vẫn gặp lỗi này, chạy:
```bash
docker exec content-ideas-db psql -U postgres -d content_ideas -c "ALTER TABLE ideas ADD COLUMN rationale TEXT;"
```

Xác nhận schema đúng:
```bash
docker exec content-ideas-db psql -U postgres -d content_ideas -c "\d ideas"
```

Bảng `ideas` phải có các columns:
```
- id (PRIMARY KEY)
- title (NOT NULL)
- description
- rationale          ← Phải có cột này
- persona
- industry
- status (DEFAULT 'pending')
- created_at
```

---

### 4️⃣ API Key Không Hợp Lệ

**Triệu chứng:**
- Response error liên quan đến API authentication
- Lỗi từ Google Gemini hoặc Deepseek

**Cách Fix:**

**Kiểm tra `.env` file:**
```bash
cat backend/.env
```

Phải có:
```env
GEMINI_API_KEY=AIza...    (API key hợp lệ)
DEEPSEEK_API_KEY=sk-...   (API key hợp lệ)
```

**Lấy API key:**
- **Gemini**: https://makersuite.google.com/app/apikey
- **Deepseek**: https://platform.deepseek.com/api_keys

---

## 📋 Danh Sách Check Chi Tiết

Nếu Generate Ideas vẫn không hoạt động, kiểm tra:

### ✓ Frontend
- [ ] Frontend chạy trên port `3910` (`http://localhost:3910`)
- [ ] Browser console (F12) không có CORS errors
- [ ] Form fields có giá trị không trống (Persona, Industry)

### ✓ Backend
- [ ] Backend chạy trên port `3911`
- [ ] Health endpoint phản hồi: `curl http://localhost:3911/health`
- [ ] Logs không có errors (xem `npm run dev` output)

### ✓ Database
- [ ] Database container đang chạy: `docker-compose ps`
- [ ] Table `ideas` có column `rationale`
- [ ] Connection string trong `.env` đúng

### ✓ API Keys
- [ ] GEMINI_API_KEY có trong `.env` và hợp lệ
- [ ] DEEPSEEK_API_KEY có trong `.env` (nếu dùng Deepseek)
- [ ] Quota API không hết

### ✓ Network
- [ ] Firewall không chặn port 3911
- [ ] Localhost resolution hoạt động (`ping localhost`)

---

## 🔍 Xem Chi Tiết Logs

### Backend Logs
```bash
# Terminal nơi chạy "npm run dev"
# Xem tất cả console.log outputs
```

### Database Logs
```bash
docker logs content-ideas-db
```

---

## 🚀 Kiểm Tra Hoàn Toàn

Sau khi fix, chạy test end-to-end:

```bash
# Test 1: Health check
curl http://localhost:3911/health

# Test 2: Get all ideas
curl http://localhost:3911/api/ideas

# Test 3: Generate ideas (Gemini)
curl -X POST http://localhost:3911/api/ideas/generate \
  -H "Content-Type: application/json" \
  -d '{
    "persona": "Content Creator",
    "industry": "Technology",
    "model": "gemini",
    "temperature": 0.7
  }'

# Test 4: Generate ideas (Deepseek)
curl -X POST http://localhost:3911/api/ideas/generate \
  -H "Content-Type: application/json" \
  -d '{
    "persona": "Content Creator",
    "industry": "Technology",
    "model": "deepseek",
    "temperature": 0.7
  }'
```

---

## 📞 Nếu Vẫn Gặp Sự Cố

1. **Chạy diagnostic script:** `node diagnose-connection.js`
2. **Cung cấp exact error message** từ:
   - Browser console (F12)
   - Backend terminal logs
   - Response từ API test
3. **Check:**
   - Phiên bản Node.js: `node -v` (cần >= 16)
   - Docker có chạy: `docker ps`
   - Ports có free: `curl localhost:3911/health`

---

## 🎯 Tóm Tắt - 3 Bước Khắc Phục Nhanh

```bash
# 1. Cài dependencies
cd backend && npm install && cd ..

# 2. Khởi động hệ thống
docker-compose up -d          # Database
cd backend && npm run dev     # Backend (giữ terminal mở)

# 3. Trong terminal khác, chạy frontend
cd frontend && npm run dev    # Frontend (port 3910)
```

Vậy là xong! Truy cập `http://localhost:3910` và test Generate Ideas.

---

## 📝 Ghi Chú Kỹ Thuật

### Các Lỗi Đã Fix

1. ✅ **Gemini Model Update**: `gemini-1.5-pro` → `gemini-2.0-flash`
   - File: [LLMClient.ts](backend/src/services/LLMClient.ts#L52)

2. ✅ **Database Schema**: Thêm column `rationale`
   - Command: `ALTER TABLE ideas ADD COLUMN rationale TEXT;`

3. ✅ **Frontend Error Handling**: Cải thiện error messages
   - File: [page.tsx](frontend/app/page.tsx#L114-L165)
   - Thêm health check endpoint test trước generate
   - Hiển thị chi tiết lỗi cho user

4. ✅ **TypeScript**: Loại bỏ unnecessary `await`
   - File: [LLMClient.ts](backend/src/services/LLMClient.ts#L60)

### Architecture Hiện Tại

```
Frontend (Next.js, port 3910)
    ↓ (HTTP axios)
Backend (Fastify, port 3911)
    ↓
AI Models (Gemini 2.0 Flash / Deepseek)
    ↓
Database (PostgreSQL)
```

---

**Last Updated:** 2025-11-02
**Status:** ✅ All Issues Fixed & Tested
