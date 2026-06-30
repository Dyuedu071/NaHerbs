package vn.io.naherb.chatbot.dto;

public record KnowledgeUploadResponse(
        KnowledgeDocumentSummaryResponse document, boolean ingestStarted, String message) {}
