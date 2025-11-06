# 🤖 Hướng Dẫn Generate Brief từ Idea bằng AI

## Tổng Quan

Tính năng này cho phép bạn tự động sinh ra **bản kế hoạch nội dung chi tiết (Brief)** từ một ý tưởng (Idea) đã có trong database, sử dụng AI (Gemini hoặc Deepseek).

## 🎯 Quy Trình Hoạt Động

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Ideas   │ ---> │ AI Model │ ---> │  Brief   │ ---> │ Database │
│ Database │      │ (Gemini/ │      │  Parser  │      │  Save    │
└──────────┘      │Deepseek) │      └──────────┘      └──────────┘
                  └──────────┘
```

### Chi Tiết Từng Bước:

1. **Lấy Idea từ Database**: Chọn một idea theo `idea_id`
2. **Tạo Prompt**: Xây dựng prompt có cấu trúc cho AI dựa trên thông tin idea
3. **Gọi AI**: Gửi request đến Gemini hoặc Deepseek
4. **Parse Response**: Trích xuất và validate JSON response từ AI
5. **Lưu Brief**: Tạo bản ghi mới trong bảng `briefs` với status `draft`

## 📋 API Endpoint

### POST `/api/briefs/generate`

Generate brief từ idea sử dụng AI.

#### Request Body:

```json
{
  "idea_id": 2,
  "model": "gemini",
  "temperature": 0.7,
  "additional_context": "Tập trung vào các chiến lược marketing thực tế"
}
```

#### Parameters:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `idea_id` | number | **Yes** | - | ID của idea trong database |
| `model` | string | No | `"gemini"` | AI model: `"gemini"` hoặc `"deepseek"` |
| `temperature` | number | No | `0.7` | Creativity level (0.0 - 2.0) |
| `additional_context` | string | No | - | Thông tin bổ sung cho AI |

#### Success Response (201):

```json
{
  "success": true,
  "message": "Brief generated successfully by AI",
  "brief": {
    "id": 10,
    "idea_id": 2,
    "title": "Chiến Lược Bán Tivi Hiệu Quả Mùa Giáng Sinh",
    "content_plan": "Bản kế hoạch chi tiết 3-5 đoạn văn...",
    "target_audience": "Khách hàng mua sắm mùa lễ, gia đình trẻ...",
    "key_points": [
      "Khuyến mãi đặc biệt",
      "Bundle deals",
      "Free delivery"
    ],
    "tone": "friendly, promotional, urgency-driven",
    "word_count": 1500,
    "keywords": ["tivi", "giáng sinh", "khuyến mãi", "smart tv"],
    "status": "draft",
    "created_at": "2025-11-03T14:30:00.000Z"
  }
}
```

#### Error Responses:

**400 - Missing Required Field:**
```json
{
  "error": "Missing required field",
  "required": ["idea_id"]
}
```

**404 - Idea Not Found:**
```json
{
  "error": "Idea not found",
  "details": "Idea with ID 999 not found"
}
```

**500 - Generation Failed:**
```json
{
  "error": "Failed to generate brief",
  "details": "Failed to parse AI-generated brief. Please try again."
}
```

## 🔧 Cấu Trúc Brief Được Generate

AI sẽ tạo ra một brief với cấu trúc sau:

```typescript
{
  title: string,              // Tiêu đề hấp dẫn (max 100 ký tự)
  content_plan: string,       // Kế hoạch chi tiết 3-5 đoạn (min 200 từ)
  target_audience: string,    // Mô tả đối tượng mục tiêu
  key_points: string[],       // 3-10 điểm chính cần cover
  tone: string,               // Tone viết (friendly, professional, etc.)
  word_count: number,         // Số từ đề xuất (500-3000)
  keywords: string[]          // 5-10 từ khóa SEO
}
```

## 💻 Ví Dụ Sử Dụng

### 1. Với cURL:

```bash
curl -X POST http://localhost:3911/api/briefs/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea_id": 2,
    "model": "gemini",
    "temperature": 0.7,
    "additional_context": "Tập trung vào digital marketing và social media"
  }'
```

### 2. Với JavaScript/Axios:

```javascript
const axios = require('axios');

async function generateBrief(ideaId) {
  try {
    const response = await axios.post('http://localhost:3911/api/briefs/generate', {
      idea_id: ideaId,
      model: 'gemini',
      temperature: 0.7,
      additional_context: 'Focus on actionable tips'
    });

    console.log('✅ Brief generated:', response.data.brief);
    return response.data.brief;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Sử dụng
generateBrief(2);
```

### 3. Với Python/Requests:

```python
import requests

def generate_brief(idea_id: int):
    url = "http://localhost:3911/api/briefs/generate"
    payload = {
        "idea_id": idea_id,
        "model": "deepseek",
        "temperature": 0.8,
        "additional_context": "Emphasize data-driven insights"
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 201:
        brief = response.json()['brief']
        print(f"✅ Brief created: {brief['title']}")
        return brief
    else:
        print(f"❌ Error: {response.json()}")
        return None

# Sử dụng
generate_brief(2)
```

## 🔑 Setup API Keys

Để tính năng hoạt động, bạn cần cấu hình API keys trong file `.env`:

```env
# Backend .env file
GEMINI_API_KEY=your_gemini_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### Lấy API Keys:

1. **Gemini (Google)**:
   - Truy cập: https://makersuite.google.com/app/apikey
   - Đăng nhập với Google account
   - Click "Create API Key"
   - Copy key vào `.env`

2. **Deepseek**:
   - Truy cập: https://platform.deepseek.com
   - Đăng ký/Đăng nhập
   - Vào "API Keys" → "Create new key"
   - Copy key vào `.env`

⚠️ **Lưu ý**: 
- Không commit file `.env` lên Git
- Giữ API keys bảo mật
- Monitor usage để tránh vượt quota

## 📊 Prompt Template

Đây là template prompt được sử dụng:

```
You are an expert content strategist. Based on the following content idea, create a detailed content brief.

CONTENT IDEA:
Title: {idea.title}
Description: {idea.description}
Rationale: {idea.rationale}
Target Persona: {idea.persona}
Industry: {idea.industry}
{additional_context}

TASK:
Create a comprehensive content brief with the following structure. Return ONLY a valid JSON object with these exact fields:

{
  "title": "A clear, engaging title for the content piece (max 100 characters)",
  "content_plan": "A detailed 3-5 paragraph plan describing: 
    1) Opening hook and introduction approach, 
    2) Main body structure with key sections, 
    3) Examples and case studies to include, 
    4) Call-to-action and conclusion strategy. Be specific and actionable.",
  "target_audience": "Detailed description of the target audience...",
  "key_points": ["Main point 1", "Main point 2", "Main point 3", "..."],
  "tone": "The writing tone (e.g., professional, conversational, authoritative)",
  "word_count": 1500,
  "keywords": ["keyword1", "keyword2", "keyword3", "...5-10 SEO keywords"]
}
```

## 🎨 Tuning Temperature

Temperature điều chỉnh độ sáng tạo của AI:

| Temperature | Đặc Điểm | Use Case |
|-------------|----------|----------|
| 0.1 - 0.3 | Rất conservative, predictable | Technical documentation, legal content |
| 0.4 - 0.7 | Balanced, cân bằng | General marketing content, blog posts |
| 0.8 - 1.2 | Creative, đa dạng | Creative writing, brainstorming |
| 1.3 - 2.0 | Rất creative, có thể random | Experimental content, artistic projects |

**Khuyến nghị**: Dùng `0.7` cho hầu hết các trường hợp.

## 🧪 Testing Script

Sử dụng script test có sẵn:

```bash
# Chạy từ root directory
node test-generate-brief.js
```

Script này sẽ:
1. ✅ Lấy danh sách ideas
2. ✅ Chọn idea đầu tiên
3. ✅ Generate brief bằng AI
4. ✅ Hiển thị kết quả đẹp mắt
5. ✅ Verify brief trong database

## 🚨 Troubleshooting

### Lỗi: "GEMINI_API_KEY environment variable is required"

**Nguyên nhân**: Chưa cấu hình API key trong `.env`

**Giải pháp**:
```bash
cd backend
echo "GEMINI_API_KEY=your_key_here" >> .env
npm run dev  # Restart server
```

### Lỗi: "429 Too Many Requests"

**Nguyên nhân**: Vượt quota API (free tier)

**Giải pháp**:
- Đợi một lúc rồi thử lại
- Upgrade plan
- Chuyển sang model khác (Gemini ↔ Deepseek)

### Lỗi: "Failed to parse AI-generated brief"

**Nguyên nhân**: AI không trả về JSON đúng format

**Giải pháp**:
- Thử lại với temperature thấp hơn
- Kiểm tra prompt template
- Thử model khác

### Lỗi: "Idea with ID X not found"

**Nguyên nhân**: Idea không tồn tại trong database

**Giải pháp**:
```bash
# Xem danh sách ideas
curl http://localhost:3911/api/ideas

# Tạo idea mới nếu cần
curl -X POST http://localhost:3911/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Idea",
    "description": "This is a test",
    "persona": "Developer",
    "industry": "Tech"
  }'
```

## 📈 Best Practices

1. **Chọn Idea Chất Lượng**:
   - Idea nên có đầy đủ thông tin (title, description, persona, industry)
   - Rationale càng chi tiết, brief càng tốt

2. **Sử Dụng Additional Context**:
   - Thêm yêu cầu cụ thể về format, style
   - Đề cập target platform (blog, social, email)
   - Nêu các constraints (word count, tone)

3. **Review và Edit**:
   - AI-generated brief là điểm khởi đầu
   - Luôn review và chỉnh sửa cho phù hợp
   - Bổ sung thông tin brand-specific

4. **Version Control**:
   - Lưu lại các version khác nhau
   - Track changes qua status (draft → review → approved)

## 🔄 Workflow Đề Xuất

```
1. Tạo/Chọn Idea → 2. Generate Brief (AI) → 3. Review & Edit → 
4. Update Status → 5. Create Drafts → 6. Publish Content
```

## 📚 Code Reference

### Service Method:

```typescript
// backend/src/services/briefService.ts
async generateBriefFromIdea(request: GenerateBriefRequest): Promise<Brief>
```

### Route:

```typescript
// backend/src/routes/briefRoutes.ts
POST /api/briefs/generate
```

### Types:

```typescript
// backend/src/types.ts
interface GenerateBriefRequest {
  idea_id: number;
  model?: 'gemini' | 'deepseek';
  temperature?: number;
  additional_context?: string;
}

interface GeneratedBriefContent {
  title: string;
  content_plan: string;
  target_audience: string;
  key_points: string[];
  tone: string;
  word_count: number;
  keywords: string[];
}
```

## 🎉 Kết Luận

Tính năng AI-powered brief generation giúp bạn:
- ⚡ Tiết kiệm thời gian lên đến 80%
- 🎯 Tạo briefs có cấu trúc chuyên nghiệp
- 💡 Nhận insights từ AI về content strategy
- 🚀 Scale việc tạo content plans

Happy Content Creating! 🚀

---

**Liên hệ**: Nếu có vấn đề, hãy check backend logs hoặc mở issue.

