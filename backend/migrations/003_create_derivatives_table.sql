-- Migration: Create derivatives table for multi-platform content
-- Bảng lưu trữ nội dung dẫn xuất cho nhiều nền tảng

CREATE TABLE IF NOT EXISTS derivatives (
    id SERIAL PRIMARY KEY,
    brief_id INTEGER NOT NULL,
    platform VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    character_count INTEGER,
    status VARCHAR(50) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_brief
        FOREIGN KEY(brief_id)
        REFERENCES briefs(id)
        ON DELETE CASCADE,

    -- Unique constraint: one derivative per brief per platform
    CONSTRAINT unique_brief_platform
        UNIQUE(brief_id, platform)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_derivatives_brief_id ON derivatives(brief_id);
CREATE INDEX IF NOT EXISTS idx_derivatives_platform ON derivatives(platform);
CREATE INDEX IF NOT EXISTS idx_derivatives_status ON derivatives(status);
CREATE INDEX IF NOT EXISTS idx_derivatives_created_at ON derivatives(created_at);
CREATE INDEX IF NOT EXISTS idx_derivatives_published_at ON derivatives(published_at);

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_derivatives_updated_at BEFORE UPDATE
    ON derivatives FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE derivatives IS 'Bảng lưu trữ nội dung dẫn xuất cho nhiều nền tảng';
COMMENT ON COLUMN derivatives.id IS 'ID duy nhất của derivative';
COMMENT ON COLUMN derivatives.brief_id IS 'ID của brief liên kết';
COMMENT ON COLUMN derivatives.platform IS 'Tên nền tảng (twitter, linkedin, facebook, instagram, tiktok)';
COMMENT ON COLUMN derivatives.content IS 'Nội dung dẫn xuất cho nền tảng';
COMMENT ON COLUMN derivatives.character_count IS 'Số ký tự của nội dung';
COMMENT ON COLUMN derivatives.status IS 'Trạng thái: draft, scheduled, published';
COMMENT ON COLUMN derivatives.published_at IS 'Thời gian xuất bản';
COMMENT ON COLUMN derivatives.created_at IS 'Thời gian tạo';
COMMENT ON COLUMN derivatives.updated_at IS 'Thời gian cập nhật cuối';
