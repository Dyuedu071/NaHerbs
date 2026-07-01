package vn.io.naherb.chatbot.rag;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import vn.io.naherb.chatbot.ai.OpenAiClient;
import vn.io.naherb.chatbot.rag.KnowledgeIngestWriter.EmbeddedChunk;

@Service
@RequiredArgsConstructor
@Slf4j
public class KnowledgeFileIngestor {

    private static final int EMBED_BATCH_SIZE = 25;

    /** Bump when chunking/retrieval pipeline changes to force re-index. */
    private static final String INGEST_PIPELINE_VERSION = "2026-06-30-v3";

    private final KnowledgeDocumentRepository knowledgeDocumentRepository;
    private final KnowledgeChunkRepository knowledgeChunkRepository;
    private final KnowledgeIngestWriter knowledgeIngestWriter;
    private final TextChunkingService textChunkingService;
    private final EmbeddingCodec embeddingCodec;
    private final OpenAiClient openAiClient;

    public boolean ingestMarkdownFile(Path knowledgeRoot, Path file) throws IOException {
        return ingestMarkdownFile(knowledgeRoot, file, KnowledgeSourceType.SEED);
    }

    public boolean ingestMarkdownFile(Path knowledgeRoot, Path file, KnowledgeSourceType sourceType)
            throws IOException {
        Path root = knowledgeRoot.toAbsolutePath().normalize();
        Path absoluteFile = file.toAbsolutePath().normalize();
        String relativePath = root.relativize(absoluteFile).toString().replace('\\', '/');
        String rawContent = Files.readString(absoluteFile, StandardCharsets.UTF_8);
        String indexableContent = MarkdownSanitizer.forKnowledgeIndex(rawContent);
        String hash = sha256(INGEST_PIPELINE_VERSION + "|" + indexableContent);

        KnowledgeDocument document = knowledgeDocumentRepository
                .findBySourcePath(relativePath)
                .orElseGet(() -> new KnowledgeDocument(extractTitle(indexableContent, absoluteFile), sourceType, relativePath));

        if (document.getSourceType() != sourceType) {
            document.setSourceType(sourceType);
        }

        long existingChunks = document != null && document.getId() != null
                ? knowledgeChunkRepository.countEmbeddedChunksByDocumentId(document.getId())
                : 0;

        if (hash.equals(document != null ? document.getContentHash() : null)
                && document != null
                && document.getIndexedAt() != null
                && existingChunks > 0) {
            log.info("Bỏ qua ingest (không đổi, {} chunks có embedding): {}", existingChunks, relativePath);
            return false;
        }

        List<String> chunks = textChunkingService.chunkMarkdown(rawContent);
        String title = extractTitle(indexableContent, absoluteFile);
        boolean canResume = document != null
                && hash.equals(document.getContentHash())
                && document.getIndexedAt() == null
                && existingChunks > 0;

        int startIndex = 0;
        if (canResume) {
            startIndex = knowledgeIngestWriter.maxChunkIndex(document.getId()) + 1;
            if (startIndex >= chunks.size()) {
                knowledgeIngestWriter.markIndexed(document, hash);
                log.info("Hoàn tất ingest (resume): {} chunks từ {}", chunks.size(), relativePath);
                return true;
            }
            log.info(
                    "Tiếp tục ingest từ chunk {}/{} cho {}",
                    startIndex + 1,
                    chunks.size(),
                    relativePath);
        } else {
            if (document != null && document.getIndexedAt() != null && existingChunks == 0) {
                log.warn("Tài liệu {} đã đánh dấu indexed nhưng chưa có embedding — ingest lại", relativePath);
            }
            document = knowledgeIngestWriter.prepareDocument(relativePath, title, hash, document, true);
            log.info("Bắt đầu ingest {} chunks cho {}", chunks.size(), relativePath);
        }

        List<EmbeddedChunk> pendingBatch = new ArrayList<>(EMBED_BATCH_SIZE);
        for (int index = startIndex; index < chunks.size(); index++) {
            String chunkText = chunks.get(index);
            float[] vector = openAiClient.embed(chunkText);
            pendingBatch.add(new EmbeddedChunk(chunkText, embeddingCodec.encode(vector)));

            boolean endOfFile = index == chunks.size() - 1;
            if (pendingBatch.size() >= EMBED_BATCH_SIZE || endOfFile) {
                knowledgeIngestWriter.saveEmbeddedChunks(document, index - pendingBatch.size() + 1, pendingBatch);
                pendingBatch.clear();
            }

            int completed = index + 1;
            if (completed % EMBED_BATCH_SIZE == 0 || endOfFile) {
                log.info("Đang embed {}/{} chunks cho {}", completed, chunks.size(), relativePath);
            }
        }

        knowledgeIngestWriter.markIndexed(document, hash);
        log.info("Đã ingest {} chunks từ {}", chunks.size(), relativePath);
        return true;
    }

    private static String extractTitle(String content, Path file) {
        for (String line : content.split("\\R")) {
            String trimmed = line.trim();
            if (trimmed.startsWith("# ")) {
                return trimmed.substring(2).trim();
            }
        }
        return file.getFileName().toString();
    }

    private static String sha256(String content) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(content.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 không khả dụng", exception);
        }
    }
}
