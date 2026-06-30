-- Phase 4: align chatbot_configs with key-value entity (config_key / config_value)
-- Run once in Supabase SQL Editor (schema naherb).

DROP TABLE IF EXISTS naherb.chatbot_configs CASCADE;

CREATE TABLE naherb.chatbot_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
