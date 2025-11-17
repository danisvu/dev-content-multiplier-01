# 🚀 Quick Start - Deploy lên Vercel

## ✅ Đã hoàn thành

Backend đã được cấu hình sẵn sàng deploy với các file:

- ✅ `backend/vercel.json` - Cấu hình Vercel
- ✅ `backend/api/serverless.ts` - Serverless adapter  
- ✅ `backend/.swcrc` - Build config
- ✅ `backend/src/server.ts` - Đã cập nhật CORS và export
- ✅ `backend/package.json` - Đã thêm build scripts với SWC

## 🎯 Bạn cần làm gì ngay bây giờ?

### 1. Xóa biến lỗi trên Vercel (QUAN TRỌNG!)

Vào Vercel Dashboard → Backend Project → Settings → Environment Variables:

**XÓA ngay:**
- ❌ `EXAMPLE_NAME` 
- ❌ Bất kỳ biến nào có giá trị test như `I9JU23NF394R6HH`

### 2. Setup Database (2 phút)

**Option A: Neon (Khuyến nghị)**
1. Vào https://neon.tech
2. Đăng nhập bằng GitHub
3. Tạo project mới
4. Copy connection string
5. Paste vào `DATABASE_URL` trên Vercel

**Option B: Supabase**
1. Vào https://supabase.com  
2. Tạo project
3. Settings > Database > Copy URI
4. Paste vào `DATABASE_URL` trên Vercel

### 3. Cấu hình Environment Variables

Trên Vercel, đảm bảo có các biến sau:

```bash
# Bắt buộc
DATABASE_URL=postgresql://user:pass@host.region.neon.tech:5432/dbname?sslmode=require
GEMINI_API_KEY=AIzaSy...your_real_key
NODE_ENV=production

# Tùy chọn
DEEPSEEK_API_KEY=your_key_if_using
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend.vercel.app
```

### 4. Deploy

#### Cách 1: Git Auto Deploy (Dễ nhất)

```bash
git add backend/
git commit -m "Configure backend for Vercel"
git push
```

→ Vercel tự động deploy

#### Cách 2: Vercel CLI

```bash
cd backend
vercel --prod
```

### 5. Kiểm tra

```bash
curl https://your-backend.vercel.app/health
```

Kết quả mong đợi: `{"status":"ok","timestamp":"2024-..."}`

## 📖 Tài liệu chi tiết

Xem file: `backend/VERCEL_DEPLOY.md` để có hướng dẫn đầy đủ.

## ⚠️ Lưu ý quan trọng

1. **KHÔNG dùng localhost database** - Phải dùng cloud database
2. **XÓA biến EXAMPLE_NAME** - Đây là nguyên nhân gây lỗi
3. **Database URL phải có ?sslmode=require** ở cuối
4. **Build đã dùng SWC** - Nhanh hơn TypeScript compiler

## 🐛 Nếu gặp lỗi

1. Kiểm tra Vercel deployment logs
2. Đảm bảo `DATABASE_URL` kết nối được
3. Test local: `cd backend && npm run build && npm start`
4. Xem troubleshooting trong `backend/VERCEL_DEPLOY.md`

## ✨ Sau khi deploy thành công

1. Test các API endpoints:
   - `/health`
   - `/api/ideas`
   - `/api/briefs`

2. Cập nhật frontend:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   ```

3. Redeploy frontend để kết nối backend mới

## 🎉 Done!

Sau khi hoàn thành, bạn sẽ có:
- ✅ Backend chạy trên Vercel
- ✅ Database trên cloud (Neon/Supabase)
- ✅ CORS hoạt động với frontend
- ✅ SSL/HTTPS tự động
- ✅ Auto-deploy khi push code

