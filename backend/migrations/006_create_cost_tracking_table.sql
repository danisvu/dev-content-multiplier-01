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
