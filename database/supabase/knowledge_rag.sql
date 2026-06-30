-- Knowledge base tables for chatbot RAG (schema naherb)
-- Run manually on Supabase if JPA ddl-auto does not create them.

CREATE TABLE IF NOT EXISTS naherb.knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source_type VARCHAR(20) NOT NULL DEFAULT 'SEED',
    source_path TEXT,
    content_hash VARCHAR(64),
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    indexed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS naherb.knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES naherb.knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_document_id ON naherb.knowledge_chunks(document_id);

-- Optional later: enable pgvector and add vector column
-- CREATE EXTENSION IF NOT EXISTS vector;
