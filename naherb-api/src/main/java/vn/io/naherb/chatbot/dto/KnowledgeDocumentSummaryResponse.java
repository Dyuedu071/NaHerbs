package vn.io.naherb.chatbot.dto;

import java.time.Instant;
import java.util.UUID;
import vn.io.naherb.chatbot.rag.KnowledgeDocumentStatus;
import vn.io.naherb.chatbot.rag.KnowledgeSourceType;

public record KnowledgeDocumentSummaryResponse(
        UUID id,
        String fileName,
        String sourcePath,
        String title,
        KnowledgeSourceType sourceType,
        KnowledgeDocumentStatus status,
        long chunkCount,
        long embeddedChunkCount,
        Instant indexedAt,
        Long fileSizeBytes,
        Instant lastModifiedAt) {}
