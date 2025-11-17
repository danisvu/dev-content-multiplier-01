# 🚀 Hướng dẫn Deploy Backend lên Vercel

## ✅ Các file đã được cấu hình

Backend đã được cấu hình sẵn để deploy lên Vercel với:
- ✓ `vercel.json` - Cấu hình build và routing
- ✓ `api/serverless.ts` - Adapter cho Vercel serverless
- ✓ `.swcrc` - Compiler nhanh, không check type strict
- ✓ `src/server.ts` - Đã có CORS và export mặc định

## 📋 Các bước deploy

### Bước 1: Xóa biến môi trường không hợp lệ

Trong Vercel dashboard, **XÓA** các biến sau nếu có:
- ❌ `EXAMPLE_NAME` - Biến test, không cần thiết
- ❌ Bất kỳ biến nào có giá trị giả hoặc không rõ ràng

### Bước 2: Cấu hình Database URL

⚠️ **QUAN TRỌNG**: 
- ❌ KHÔNG dùng: `postgresql://postgres:postgres@localhost...`
- ✅ Dùng database cloud

**Khuyến nghị - Neon PostgreSQL** (Miễn phí, setup 2 phút):
1. Truy cập https://neon.tech
2. Đăng ký tài khoản (dùng GitHub)
3. Tạo project mới → Copy connection string
4. Paste vào `DATABASE_URL` trên Vercel

**Hoặc Supabase** (Miễn phí):
1. Truy cập https://supabase.com
2. Tạo project → Settings > Database
3. Copy "Connection string" (URI mode)
4. Paste vào `DATABASE_URL` trên Vercel

### Bước 3: Cấu hình Environment Variables trên Vercel

Vào Settings > Environment Variables và cấu hình:

**Bắt buộc:**
```bash
DATABASE_URL=postgresql://user:pass@host.neon.tech:5432/dbname?sslmode=require
GEMINI_API_KEY=AIzaSy...your_real_key_here
NODE_ENV=production
```

**Tùy chọn:**
```bash
DEEPSEEK_API_KEY=your_deepseek_key
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend.vercel.app
PORT=3911
```

> **Lưu ý:** `PORT` không bắt buộc vì Vercel tự quản lý port

### Bước 4: Xóa các biến không hợp lệ

Đảm bảo KHÔNG có các biến sau (gây lỗi):
- `EXAMPLE_NAME` (hoặc bất kỳ tên có suffix `_NAME` không rõ ràng)
- Các giá trị test như `I9JU23NF394R6HH`

### Bước 5: Deploy lên Vercel

#### Option 1: Deploy từ Git (Khuyến nghị)

1. Commit các thay đổi:
```bash
git add backend/
git commit -m "Configure backend for Vercel deployment"
git push
```

2. Trên Vercel Dashboard:
   - Import repository từ GitHub
   - Chọn thư mục `backend/` làm Root Directory
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. Thêm Environment Variables (như Bước 3)

4. Click **Deploy**

#### Option 2: Deploy trực tiếp với Vercel CLI

```bash
cd backend
npm install -g vercel
vercel login
vercel --prod
```

### Bước 6: Kiểm tra Deploy

Sau khi deploy xong, test API:

```bash
# Health check
curl https://your-backend.vercel.app/health

# Kết quả mong đợi:
# {"status":"ok","timestamp":"2024-11-17T..."}
```

```bash
# Test API endpoint
curl https://your-backend.vercel.app/api/ideas

# Hoặc dùng browser:
# https://your-backend.vercel.app/health
```

### Bước 7: Cập nhật Frontend URL

Sau khi có backend URL, cập nhật frontend:

1. Vào frontend project trên Vercel
2. Settings > Environment Variables
3. Thêm/Cập nhật:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

4. Redeploy frontend

## 🔧 Troubleshooting

### ❌ Lỗi "The value is not a valid System Environment name"

**Nguyên nhân:** Tên biến môi trường không hợp lệ

**Giải pháp:**
1. Xóa biến `EXAMPLE_NAME` 
2. Xóa các biến có giá trị test như `I9JU23NF394R6HH`
3. Tên biến hợp lệ: `DATABASE_URL`, `API_KEY`, `NODE_ENV`
4. ❌ Không hợp lệ: `EXAMPLE_NAME`, `test-var`, `MY VAR`

### ❌ Lỗi "Build failed"

**Giải pháp:**
- Kiểm tra file `package.json` có script `build`
- Đảm bảo đã cài `@swc/cli` và `@swc/core`
- Xem logs chi tiết trên Vercel

### ❌ Lỗi Database Connection

**Nguyên nhân:** 
- DATABASE_URL sai format
- Database không cho phép kết nối từ bên ngoài
- Thiếu `?sslmode=require`

**Giải pháp:**
```bash
# ✅ Đúng format:
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require

# ❌ Sai - localhost
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/db

# ❌ Sai - thiếu SSL mode
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### ❌ Lỗi CORS khi gọi từ Frontend

**Nguyên nhân:** Frontend domain chưa được cho phép

**Giải pháp:**
1. Backend đã tự động chấp nhận `.vercel.app`
2. Nếu dùng custom domain, thêm biến:
```bash
NEXT_PUBLIC_FRONTEND_URL=https://your-custom-domain.com
```
3. Redeploy backend

### ❌ Lỗi "Cannot find module"

**Giải pháp:**
- Đảm bảo chạy `npm run build` trước
- Kiểm tra `dist/` folder có đầy đủ files
- Xem `vercel.json` có đúng config

### ⚠️ Lỗi 404 trên các routes

**Nguyên nhân:** Vercel routing không khớp

**Giải pháp:**
- Kiểm tra `vercel.json` có `routes` config
- Test trực tiếp: `https://your-backend.vercel.app/api/ideas`
- Đảm bảo prefix `/api` đúng

## 📊 Monitoring

Sau khi deploy, theo dõi:

1. **Vercel Dashboard** → Your Project → Analytics
   - Request count
   - Error rate
   - Response time

2. **Logs**
   - Dashboard → Functions → View logs
   - Real-time debugging

3. **Database**
   - Neon/Supabase dashboard
   - Query performance
   - Connection pooling

## 🎯 Checklist Deploy thành công

- [ ] Xóa biến `EXAMPLE_NAME` và các biến test
- [ ] Cấu hình DATABASE_URL từ Neon/Supabase
- [ ] Thêm GEMINI_API_KEY
- [ ] Build local thành công (`npm run build`)
- [ ] Commit và push code
- [ ] Deploy trên Vercel thành công
- [ ] Test endpoint `/health` → status OK
- [ ] Test API endpoint `/api/ideas`
- [ ] Cập nhật NEXT_PUBLIC_API_URL ở frontend
- [ ] CORS hoạt động giữa frontend-backend

## 💡 Tips

1. **Development vs Production**
   ```bash
   # Local development
   npm run dev  # Không cần build
   
   # Production build
   npm run build  # Compile với SWC
   npm start      # Chạy compiled code
   ```

2. **TypeScript Errors**
   - Build dùng SWC, không check type strict
   - Để check types: `npm run type-check`
   - Strict build: `npm run build:strict`

3. **Environment Variables**
   - Local: Tạo file `.env` trong `backend/`
   - Vercel: Settings > Environment Variables
   - Phân biệt Development/Preview/Production

4. **Database Migrations**
   ```bash
   # Chạy migrations sau deploy
   vercel env pull  # Download env vars
   npm run migrate:run
   ```

## 🆘 Support

Nếu vẫn gặp vấn đề:
1. Kiểm tra Vercel logs chi tiết
2. Test local với `npm run build && npm start`
3. Verify DATABASE_URL kết nối được
4. Kiểm tra tất cả env vars đã set đúng

