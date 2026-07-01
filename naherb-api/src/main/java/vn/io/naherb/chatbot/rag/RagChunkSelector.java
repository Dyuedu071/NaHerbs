package vn.io.naherb.chatbot.rag;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

final class RagChunkSelector {

    private RagChunkSelector() {}

    static List<RagRetrievalService.RetrievedChunk> selectPerDocument(
            List<RagRetrievalService.RetrievedChunk> ranked, int perDocumentTopK, int globalTopK) {
        Map<String, List<RagRetrievalService.RetrievedChunk>> byDocument = new LinkedHashMap<>();
        for (RagRetrievalService.RetrievedChunk chunk : ranked) {
            byDocument.computeIfAbsent(chunk.documentTitle(), key -> new ArrayList<>()).add(chunk);
        }

        List<RagRetrievalService.RetrievedChunk> merged = new ArrayList<>();
        for (List<RagRetrievalService.RetrievedChunk> documentChunks : byDocument.values()) {
            documentChunks.sort(Comparator.comparingDouble(RagRetrievalService.RetrievedChunk::score).reversed());
            int limit = Math.min(Math.max(1, perDocumentTopK), documentChunks.size());
            merged.addAll(documentChunks.subList(0, limit));
        }

        merged.sort(Comparator.comparingDouble(RagRetrievalService.RetrievedChunk::score).reversed());
        int cap = Math.max(1, globalTopK);
        return merged.size() <= cap ? merged : merged.subList(0, cap);
    }

    static boolean shouldSkipKnowledgeSection(String section) {
        String lower = section.toLowerCase(Locale.ROOT);
        String firstLine = section.lines().findFirst().orElse("").trim().toLowerCase(Locale.ROOT);
        if (firstLine.startsWith("# mục blog")) {
            return true;
        }
        if (firstLine.contains("từ khóa làm seo")) {
            return true;
        }
        if (lower.contains("| gối thảo dược |") && lower.contains("| tinh dầu thiên nhiên |")) {
            return true;
        }
        return false;
    }
}
