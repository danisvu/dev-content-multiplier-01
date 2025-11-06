# Content Ideas Manager with AI Generation

Ứng dụng quản lý ý tưởng nội dung với tính năng sinh ý tưởng tự động bằng AI. Backend sử dụng Fastify + TypeScript + PostgreSQL, frontend sử dụng Next.js + Tailwind CSS.

## 🚀 Tính năng nổi bật

- **Quản lý ý tưởng thủ công**: Tạo, đọc, cập nhật, xóa ý tưởng nội dung
- **Sinh ý tưởng bằng AI**: Tự động tạo 10 ý tưởng nội dung chất lượng cao
- **🆕 Generate Brief từ Idea**: AI tự động tạo kế hoạch nội dung chi tiết từ ý tưởng
- **Quản lý Content Briefs**: Lưu trữ và quản lý các bản kế hoạch nội dung
- **Hỗ trợ nhiều model AI**: Gemini (Google) và Deepseek
- **Validate JSON với AJV**: Đảm bảo dữ liệu từ AI luôn đúng định dạng
- **Retry với exponential backoff**: Tự động thử lại khi API lỗi
- **UI/UX hiện đại**: Loading spinner, error handling, responsive design

## Cấu trúc dự án

```
├── backend/                 # Fastify API server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   │   └── ideaRoutes.ts    # Routes cho ideas + AI generation
│   │   ├── services/       # Business logic
│   │   │   ├── IdeaService.ts   # Service xử lý ideas
│   │   │   └── LLMClient.ts     # Client cho Gemini & Deepseek
│   │   ├── types.ts        # TypeScript types
│   │   ├── database.ts     # Database connection
│   │   └── server.ts       # Server entry point
│   ├── migrations/         # Database migrations
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Next.js frontend
│   ├── app/
│   │   ├── page.tsx        # Main page với AI generation form
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── package.json
│   └── ├── tailwind.config.js
├── docker-compose.yml      # PostgreSQL container
└── README.md
```

## 📋 Cài đặt và chạy

### 1. Khởi động database

```bash
docker-compose up -d
```

### 2. Cấu hình API Keys

Tạo file `backend/.env` và thêm API keys:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/content_ideas
PORT=3911
NODE_ENV=development

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

**Lấy API Keys:**
- **Gemini API**: Truy cập https://makersuite.google.com/app/apikey
- **Deepseek API**: Truy cập https://platform.deepseek.com/api_keys

### 3. Cài đặt và chạy backend

```bash
cd backend
npm install
npm run dev
```

Backend sẽ chạy tại `http://localhost:3911`

### 4. Cài đặt và chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3910`

## 🌐 API Endpoints

### Ideas Management
- `GET /api/ideas` - Lấy tất cả ý tưởng
- `GET /api/ideas/:id` - Lấy ý tưởng theo ID
- `POST /api/ideas` - Tạo ý tưởng mới
- `PUT /api/ideas/:id` - Cập nhật ý tưởng
- `DELETE /api/ideas/:id` - Xóa ý tưởng
- `POST /api/ideas/generate` - Tự động sinh ý tưởng bằng AI

**Request body cho `/api/ideas/generate`:**
```json
{
  "persona": "Content Creator",
  "industry": "Technology", 
  "model": "gemini",
  "temperature": 0.7
}
```

### 🆕 Briefs Management
- `GET /api/briefs` - Lấy tất cả briefs
- `GET /api/briefs/:id` - Lấy brief theo ID
- `POST /api/briefs` - Tạo brief mới
- `PUT /api/briefs/:id` - Cập nhật brief
- `DELETE /api/briefs/:id` - Xóa brief
- `POST /api/briefs/generate` - **Tự động sinh brief từ idea bằng AI** 🤖
- `PATCH /api/ideas/:id/status` - 🔒 **Cập nhật status của idea** (required: 'selected' để generate brief)

**Request body cho `/api/briefs/generate`:**
```json
{
  "idea_id": 2,
  "model": "gemini",
  "temperature": 0.7,
  "additional_context": "Tập trung vào các chiến lược marketing thực tế"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Brief generated successfully by AI",
  "brief": {
    "id": 10,
    "idea_id": 2,
    "title": "Chiến Lược Bán Tivi Hiệu Quả Mùa Giáng Sinh",
    "content_plan": "Bản kế hoạch chi tiết...",
    "target_audience": "Khách hàng mua sắm mùa lễ...",
    "key_points": ["Khuyến mãi", "Bundle deals", "Free delivery"],
    "tone": "friendly, promotional",
    "word_count": 1500,
    "keywords": ["tivi", "giáng sinh", "khuyến mãi"],
    "status": "draft"
  }
}
```

### System
- `GET /health` - Health check

## 🗄️ Database Schema

### Bảng `ideas`
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(255) NOT NULL)
- `description` (TEXT)
- `rationale` (TEXT) - Lý do ý tưởng sẽ hiệu quả
- `persona` (VARCHAR(100))
- `industry` (VARCHAR(100))
- `status` (VARCHAR(50) DEFAULT 'pending')
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

### 🆕 Bảng `briefs`
- `id` (SERIAL PRIMARY KEY)
- `idea_id` (INTEGER REFERENCES ideas(id)) - Liên kết với idea
- `title` (VARCHAR(255) NOT NULL)
- `content_plan` (TEXT NOT NULL) - Kế hoạch nội dung chi tiết
- `target_audience` (TEXT NOT NULL) - Đối tượng mục tiêu
- `key_points` (TEXT[] NOT NULL) - Các điểm chính cần cover
- `tone` (VARCHAR(100)) - Tone viết
- `word_count` (INTEGER) - Số từ đề xuất
- `keywords` (TEXT[]) - Từ khóa SEO
- `status` (VARCHAR(50) DEFAULT 'draft') - draft, review, approved, published
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

## 💡 Sử dụng

### 1. Sinh ý tưởng bằng AI
1. Truy cập `http://localhost:3910`
2. Điền form "🤖 Tự động sinh ý tưởng bằng AI":
   - **Persona**: Đối tượng mục tiêu (VD: Content Creator, Digital Marketer)
   - **Industry**: Lĩnh vực (VD: Technology, Fashion, Food)
   - **Model AI**: Chọn Gemini hoặc Deepseek
   - **Temperature**: Độ sáng tạo (0 = conservative, 2 = creative)
3. Click "🚀 Generate Ideas"
4. Chờ loading spinner và xem 10 ý tưởng được tạo

### 2. 🆕 Generate Brief từ Idea (AI-Powered)

⚠️ **Lưu ý**: Idea phải có `status = 'selected'` trước khi generate brief.

```bash
# Bước 1: Update idea status thành 'selected'
curl -X PATCH http://localhost:3911/api/ideas/2/status \
  -H "Content-Type: application/json" \
  -d '{"status": "selected"}'

# Bước 2: Generate brief
curl -X POST http://localhost:3911/api/briefs/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea_id": 2,
    "model": "gemini",
    "temperature": 0.7,
    "additional_context": "Focus on practical examples"
  }'

# Hoặc dùng test script (tự động làm cả 2 bước)
./test-brief-validation.sh
```

**Kết quả:** AI sẽ tạo ra một brief chi tiết bao gồm:
- ✅ Title (tiêu đề hấp dẫn)
- ✅ Content Plan (kế hoạch 3-5 đoạn)
- ✅ Target Audience (đối tượng mục tiêu)
- ✅ Key Points (3-10 điểm chính)
- ✅ Tone (friendly, professional, etc.)
- ✅ Word Count (số từ đề xuất)
- ✅ Keywords (5-10 từ khóa SEO)

**🔒 Status Validation:**
- Chỉ ideas có `status = 'selected'` mới được generate brief
- Đảm bảo quality control và tiết kiệm AI quota
- Xem chi tiết: [STATUS_VALIDATION_GUIDE.md](./STATUS_VALIDATION_GUIDE.md)

**Chi tiết kỹ thuật**: [BRIEF_GENERATION_GUIDE.md](./BRIEF_GENERATION_GUIDE.md)

### 3. Quản lý ý tưởng thủ công
1. Sử dụng form "Tạo ý tưởng mới" để thêm ý tưởng thủ công
2. Xem danh sách tất cả ý tưởng ở bên phải
3. Xóa ý tưởng không cần thiết

## 🛠️ Tech Stack

### Backend
- **Framework**: Fastify 4.24.3
- **Language**: TypeScript 5.2.2
- **Database**: PostgreSQL 15
- **AI SDK**: 
  - @google/generative-ai (Gemini)
  - openai (Deepseek)
- **Validation**: AJV
- **ORM**: Node.js postgres driver

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.3.5
- **HTTP Client**: Axios
- **Language**: TypeScript 5

### Infrastructure
- **Database**: PostgreSQL (Docker)
- **Containerization**: Docker Compose

## 🔧 Development

### Build cho production

```bash
# Backend
cd backend
npm run build

# Frontend  
cd frontend
npm run build
```

### Database Migration

```bash
cd backend
npm run migrate
```

## 🐛 Troubleshooting

### Common Issues

1. **API Keys không hợp lệ**
   - Kiểm tra lại API keys trong file `.env`
   - Đảm bảo API keys có quyền truy cập

2. **Database connection failed**
   - Đảm bảo PostgreSQL container đang chạy: `docker-compose ps`
   - Kiểm tra connection string trong `.env`

3. **CORS errors**
   - Backend đã cấu hình CORS cho `localhost:3910`, `localhost:3911`
   - Kiểm tra port frontend đang chạy

4. **AI generation fails**
   - Kiểm tra API keys và quota
   - Thử đổi model AI khác
   - Xem console logs cho chi tiết lỗi

## 📝 License

MIT License
