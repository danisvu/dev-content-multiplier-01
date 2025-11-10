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
