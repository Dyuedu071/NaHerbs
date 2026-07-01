package vn.io.naherb.chatbot.rag;

import java.util.concurrent.atomic.AtomicBoolean;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class KnowledgeBootstrapService {

    private final KnowledgeChunkRepository knowledgeChunkRepository;
    private final KnowledgeDocumentRepository knowledgeDocumentRepository;
    private final KnowledgeIngestService knowledgeIngestService;
    private final AtomicBoolean reindexAttempted = new AtomicBoolean(false);

    public KnowledgeBootstrapService(
            KnowledgeChunkRepository knowledgeChunkRepository,
            KnowledgeDocumentRepository knowledgeDocumentRepository,
            @Lazy KnowledgeIngestService knowledgeIngestService) {
        this.knowledgeChunkRepository = knowledgeChunkRepository;
        this.knowledgeDocumentRepository = knowledgeDocumentRepository;
        this.knowledgeIngestService = knowledgeIngestService;
    }

    @Transactional
    public void resetIndexIfNoEmbeddings() {
        long documents = knowledgeDocumentRepository.count();
        long embeddedChunks = knowledgeChunkRepository.countWithEmbeddings();
        if (documents == 0 || embeddedChunks > 0) {
            return;
        }
        log.warn(
                "Phát hiện {} knowledge_documents nhưng 0 embedding — xóa index cũ và ingest lại từ đầu",
                documents);
        knowledgeChunkRepository.deleteAllInBatch();
        knowledgeDocumentRepository.deleteAllInBatch();
    }

    public void ensureIndexedIfEmpty() {
        if (knowledgeChunkRepository.countWithEmbeddings() > 0) {
            return;
        }
        if (!reindexAttempted.compareAndSet(false, true)) {
            return;
        }
        log.warn("knowledge_chunks đang trống — kích hoạt ingest knowledge ngay");
        knowledgeIngestService.ingestDirectory(knowledgeIngestService.resolveKnowledgeDirectory());
        long total = knowledgeChunkRepository.countWithEmbeddings();
        if (total == 0) {
            log.error(
                    "Sau ingest vẫn không có knowledge chunk có embedding. Kiểm tra CHATBOT_KNOWLEDGE_PATH, AI_API_KEY và log ingest startup.");
        } else {
            log.info("Ingest khẩn cấp hoàn tất — {} chunks có embedding trong DB", total);
        }
    }
}
