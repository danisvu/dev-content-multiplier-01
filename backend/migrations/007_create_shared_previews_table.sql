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
