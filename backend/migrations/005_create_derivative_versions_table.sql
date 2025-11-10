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
