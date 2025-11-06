-- Migration: Create briefs table for content planning
-- Bảng lưu trữ bản kế hoạch nội dung (content briefs)

CREATE TABLE IF NOT EXISTS briefs (
    id SERIAL PRIMARY KEY,
    idea_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_plan TEXT NOT NULL,
    target_audience TEXT,
    key_points TEXT[],
    tone VARCHAR(100),
    word_count INTEGER,
    keywords TEXT[],
    reference_links TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_idea
        FOREIGN KEY(idea_id) 
        REFERENCES ideas(id)
        ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_briefs_idea_id ON briefs(idea_id);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_briefs_updated_at BEFORE UPDATE
    ON briefs FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE briefs IS 'Bảng lưu trữ bản kế hoạch nội dung';
COMMENT ON COLUMN briefs.id IS 'ID duy nhất của brief';
COMMENT ON COLUMN briefs.idea_id IS 'ID của ý tưởng liên kết';
COMMENT ON COLUMN briefs.title IS 'Tiêu đề của brief';
COMMENT ON COLUMN briefs.content_plan IS 'Nội dung kế hoạch chi tiết';
COMMENT ON COLUMN briefs.target_audience IS 'Đối tượng người đọc mục tiêu';
COMMENT ON COLUMN briefs.key_points IS 'Các điểm chính cần đề cập';
COMMENT ON COLUMN briefs.tone IS 'Giọng điệu viết (formal, casual, professional, etc.)';
COMMENT ON COLUMN briefs.word_count IS 'Số lượng từ mục tiêu';
COMMENT ON COLUMN briefs.keywords IS 'Từ khóa SEO cần sử dụng';
COMMENT ON COLUMN briefs.reference_links IS 'Tài liệu tham khảo';
COMMENT ON COLUMN briefs.status IS 'Trạng thái: draft, review, approved, published';
COMMENT ON COLUMN briefs.created_at IS 'Thời gian tạo';
COMMENT ON COLUMN briefs.updated_at IS 'Thời gian cập nhật cuối';

