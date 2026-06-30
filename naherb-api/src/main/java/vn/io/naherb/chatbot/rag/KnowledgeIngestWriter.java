package vn.io.naherb.chatbot.rag;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
class KnowledgeIngestWriter {

    private final KnowledgeDocumentRepository knowledgeDocumentRepository;
    private final KnowledgeChunkRepository knowledgeChunkRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    KnowledgeDocument prepareDocument(
            String relativePath, String title, String contentHash, KnowledgeDocument existing, boolean resetChunks) {
        KnowledgeDocument document = existing != null
                ? existing
                : new KnowledgeDocument(title, KnowledgeSourceType.SEED, relativePath);
        document.setTitle(title);
        document.setContentHash(contentHash);
        document.setStatus(KnowledgeDocumentStatus.PUBLISHED);
        document.setIndexedAt(null);
        document = knowledgeDocumentRepository.save(document);

        if (resetChunks && document.getId() != null) {
            knowledgeChunkRepository.deleteByDocumentId(document.getId());
            knowledgeChunkRepository.flush();
        }
        return document;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void saveEmbeddedChunks(KnowledgeDocument document, int startIndex, List<EmbeddedChunk> batch) {
        int index = startIndex;
        for (EmbeddedChunk chunk : batch) {
            knowledgeChunkRepository.save(
                    new KnowledgeChunk(document, index++, chunk.text(), chunk.embedding()));
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void markIndexed(KnowledgeDocument document, String contentHash) {
        document.setContentHash(contentHash);
        document.setIndexedAt(Instant.now());
        knowledgeDocumentRepository.save(document);
    }

    int maxChunkIndex(UUID documentId) {
        return knowledgeChunkRepository.maxChunkIndexByDocumentId(documentId);
    }

    record EmbeddedChunk(String text, String embedding) {}
}
