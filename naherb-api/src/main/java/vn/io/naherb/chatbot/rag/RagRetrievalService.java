package vn.io.naherb.chatbot.rag;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import vn.io.naherb.chatbot.ai.OpenAiClient;
import vn.io.naherb.chatbot.config.ChatbotProperties;
import vn.io.naherb.exception.AiUnavailableException;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagRetrievalService {

    private final KnowledgeChunkRepository knowledgeChunkRepository;
    private final OpenAiClient openAiClient;
    private final EmbeddingCodec embeddingCodec;
    private final ChatbotProperties chatbotProperties;

    public List<RetrievedChunk> retrieve(String query) {
        if (!StringUtils.hasText(query)) {
            return List.of();
        }

        List<KnowledgeChunk> chunks = knowledgeChunkRepository.findAllPublished();
        if (chunks.isEmpty()) {
            log.warn(
                    "RAG: không có knowledge chunk có embedding trong DB — kiểm tra ingest startup và bảng knowledge_chunks");
            return List.of();
        }

        float[] queryVector = null;
        try {
            queryVector = openAiClient.embed(query.trim());
        } catch (AiUnavailableException exception) {
            log.warn("Embedding câu hỏi thất bại, dùng keyword-only RAG: {}", exception.getMessage());
        }

        List<RetrievedChunk> ranked = new ArrayList<>();
        for (KnowledgeChunk chunk : chunks) {
            double cosine = 0;
            if (queryVector != null && StringUtils.hasText(chunk.getEmbedding())) {
                float[] vector = embeddingCodec.decode(chunk.getEmbedding());
                cosine = EmbeddingCodec.cosineSimilarity(queryVector, vector);
            }
            double score = queryVector != null
                    ? RetrievalScoring.relevanceScore(query, chunk.getContent(), cosine)
                    : RetrievalScoring.keywordOverlapScore(query, chunk.getContent())
                            + RetrievalScoring.phraseOverlapScore(query, chunk.getContent());
            if (queryVector == null && score <= 0) {
                continue;
            }
            ranked.add(new RetrievedChunk(
                    chunk.getContent(),
                    chunk.getDocument().getTitle(),
                    score,
                    cosine,
                    RetrievalScoring.keywordOverlapScore(query, chunk.getContent())));
        }

        if (ranked.isEmpty()) {
            log.warn("RAG: có {} chunk nhưng không chunk nào có embedding hợp lệ", chunks.size());
            return List.of();
        }

        ranked.sort(Comparator.comparingDouble(RetrievedChunk::score).reversed());
        List<RetrievedChunk> selected = RagChunkSelector.selectPerDocument(
                ranked,
                chatbotProperties.getRagPerDocumentTopK(),
                chatbotProperties.getRagTopK());

        log.info(
                "RAG chọn {} chunks từ {} tài liệu: {}",
                selected.size(),
                selected.stream().map(RetrievedChunk::documentTitle).distinct().count(),
                selected.stream().map(RetrievedChunk::documentTitle).distinct().toList());

        if (log.isDebugEnabled()) {
            for (RetrievedChunk chunk : selected) {
                log.debug(
                        "RAG hit score={} cosine={} keyword={} doc={}",
                        String.format("%.3f", chunk.score()),
                        String.format("%.3f", chunk.cosineScore()),
                        String.format("%.3f", chunk.keywordScore()),
                        chunk.documentTitle());
            }
        }

        return selected;
    }

    public record RetrievedChunk(
            String content, String documentTitle, double score, double cosineScore, double keywordScore) {}
}
