CREATE TABLE IF NOT EXISTS ideas (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    rationale TEXT,
    persona VARCHAR(100),
    industry VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at);
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
-- Migration: Create event logs table for audit trail
-- Bảng lưu trữ nhật ký sự kiện cho kiểm toán

CREATE TABLE IF NOT EXISTS event_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    user_id VARCHAR(100),
    metadata JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_logs_type ON event_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_event_logs_entity ON event_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_created_at ON event_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_event_logs_status ON event_logs(status);

-- Add comments for documentation
COMMENT ON TABLE event_logs IS 'Bảng lưu trữ nhật ký sự kiện cho kiểm toán';
COMMENT ON COLUMN event_logs.id IS 'ID duy nhất của sự kiện';
COMMENT ON COLUMN event_logs.event_type IS 'Loại sự kiện (e.g., derivative.published, brief.generated)';
COMMENT ON COLUMN event_logs.entity_type IS 'Loại thực thể (derivative, brief, idea)';
COMMENT ON COLUMN event_logs.entity_id IS 'ID của thực thể';
COMMENT ON COLUMN event_logs.user_id IS 'ID của người dùng tạo sự kiện';
COMMENT ON COLUMN event_logs.metadata IS 'Dữ liệu bổ sung JSON (platform, changes, etc.)';
COMMENT ON COLUMN event_logs.ip_address IS 'Địa chỉ IP của yêu cầu';
COMMENT ON COLUMN event_logs.user_agent IS 'User agent của trình duyệt';
COMMENT ON COLUMN event_logs.status IS 'Trạng thái: success, failed';
COMMENT ON COLUMN event_logs.error_message IS 'Thông báo lỗi nếu có';
COMMENT ON COLUMN event_logs.created_at IS 'Thời gian tạo sự kiện';
-- Migration: Create derivative versions table for version control
-- Bảng lưu trữ lịch sử các phiên bản của derivatives

CREATE TABLE IF NOT EXISTS derivative_versions (
    id SERIAL PRIMARY KEY,
    derivative_id INTEGER NOT NULL,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    character_count INTEGER,
    change_summary VARCHAR(255),
    change_type VARCHAR(50),
    changed_by VARCHAR(100),
    change_reason TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_derivative
        FOREIGN KEY(derivative_id)
        REFERENCES derivatives(id)
        ON DELETE CASCADE,

    -- Unique constraint: one current version per derivative
    CONSTRAINT unique_current_version
        UNIQUE(derivative_id, is_current)
        WHERE is_current = TRUE,

    -- Unique constraint: version number per derivative
    CONSTRAINT unique_version_number
        UNIQUE(derivative_id, version_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_derivative_versions_derivative_id ON derivative_versions(derivative_id);
CREATE INDEX IF NOT EXISTS idx_derivative_versions_version_number ON derivative_versions(version_number);
CREATE INDEX IF NOT EXISTS idx_derivative_versions_is_current ON derivative_versions(is_current);
CREATE INDEX IF NOT EXISTS idx_derivative_versions_created_at ON derivative_versions(created_at);
CREATE INDEX IF NOT EXISTS idx_derivative_versions_change_type ON derivative_versions(change_type);

-- Add comments for documentation
COMMENT ON TABLE derivative_versions IS 'Bảng lưu trữ lịch sử phiên bản của derivatives';
COMMENT ON COLUMN derivative_versions.id IS 'ID duy nhất của phiên bản';
COMMENT ON COLUMN derivative_versions.derivative_id IS 'ID của derivative liên kết';
COMMENT ON COLUMN derivative_versions.version_number IS 'Số thứ tự phiên bản';
COMMENT ON COLUMN derivative_versions.content IS 'Nội dung của phiên bản này';
COMMENT ON COLUMN derivative_versions.character_count IS 'Số ký tự của phiên bản này';
COMMENT ON COLUMN derivative_versions.change_summary IS 'Tóm tắt thay đổi (e.g., "Updated tone")';
COMMENT ON COLUMN derivative_versions.change_type IS 'Loại thay đổi: created, edited, ai_regenerated, rollback';
COMMENT ON COLUMN derivative_versions.changed_by IS 'ID của người thực hiện thay đổi';
COMMENT ON COLUMN derivative_versions.change_reason IS 'Lý do thay đổi';
COMMENT ON COLUMN derivative_versions.is_current IS 'Phiên bản này có phải là phiên bản hiện tại hay không';
COMMENT ON COLUMN derivative_versions.created_at IS 'Thời gian tạo phiên bản';
-- Create cost_tracking table for tracking API/LLM costs per derivative
CREATE TABLE cost_tracking (
    id SERIAL PRIMARY KEY,
    derivative_id INTEGER NOT NULL,
    cost_type VARCHAR(50) NOT NULL,  -- 'llm', 'api_call', 'storage', 'processing'
    provider VARCHAR(50),  -- 'gemini', 'deepseek', 'openai'
    cost_amount DECIMAL(10, 6),  -- Cost in USD
    currency VARCHAR(3) DEFAULT 'USD',
    tokens_used INTEGER,  -- For LLM: input + output tokens
    input_tokens INTEGER,
    output_tokens INTEGER,
    request_metadata JSONB,  -- model, platform, temperature, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT fk_derivative FOREIGN KEY(derivative_id) REFERENCES derivatives(id) ON DELETE CASCADE
);

-- Indexes for efficient querying
CREATE INDEX idx_cost_tracking_derivative_id ON cost_tracking(derivative_id);
CREATE INDEX idx_cost_tracking_cost_type ON cost_tracking(cost_type);
CREATE INDEX idx_cost_tracking_provider ON cost_tracking(provider);
CREATE INDEX idx_cost_tracking_created_at ON cost_tracking(created_at);

-- Composite index for cost aggregation queries
CREATE INDEX idx_cost_tracking_derivative_type ON cost_tracking(derivative_id, cost_type);

-- Create cost_summary materialized view for faster analytics
CREATE TABLE cost_summary_cache (
    id SERIAL PRIMARY KEY,
    brief_id INTEGER,
    total_cost DECIMAL(12, 6),
    llm_cost DECIMAL(12, 6),
    api_cost DECIMAL(12, 6),
    derivative_count INTEGER,
    average_cost_per_derivative DECIMAL(10, 6),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_brief FOREIGN KEY(brief_id) REFERENCES briefs(id) ON DELETE CASCADE
);

CREATE INDEX idx_cost_summary_brief_id ON cost_summary_cache(brief_id);
-- Create shared_previews table for shareable preview links
CREATE TABLE shared_previews (
    id SERIAL PRIMARY KEY,
    brief_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,  -- Unique shareable token
    preview_type VARCHAR(50) DEFAULT 'full',  -- 'full', 'derivatives_only', 'version_history'
    expires_at TIMESTAMP WITH TIME ZONE,  -- Optional expiration
    password_hash VARCHAR(255),  -- Optional password protection
    require_password BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    max_views INTEGER,  -- Optional view limit
    allow_comments BOOLEAN DEFAULT FALSE,
    allow_downloads BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT fk_brief FOREIGN KEY(brief_id) REFERENCES briefs(id) ON DELETE CASCADE
);

-- Indexes for efficient lookups
CREATE INDEX idx_shared_previews_token ON shared_previews(token);
CREATE INDEX idx_shared_previews_brief_id ON shared_previews(brief_id);
CREATE INDEX idx_shared_previews_expires_at ON shared_previews(expires_at);
CREATE INDEX idx_shared_previews_created_at ON shared_previews(created_at);

-- Create preview_access_logs for analytics
CREATE TABLE preview_access_logs (
    id SERIAL PRIMARY KEY,
    shared_preview_id INTEGER NOT NULL,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),  -- IPv4 or IPv6
    user_agent TEXT,
    country VARCHAR(2),
    city VARCHAR(100),

    CONSTRAINT fk_shared_preview FOREIGN KEY(shared_preview_id) REFERENCES shared_previews(id) ON DELETE CASCADE
);

CREATE INDEX idx_preview_access_logs_shared_preview_id ON preview_access_logs(shared_preview_id);
CREATE INDEX idx_preview_access_logs_accessed_at ON preview_access_logs(accessed_at);
