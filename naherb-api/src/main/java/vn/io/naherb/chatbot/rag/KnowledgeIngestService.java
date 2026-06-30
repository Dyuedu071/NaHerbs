package vn.io.naherb.chatbot.rag;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Locale;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import vn.io.naherb.chatbot.config.ChatbotProperties;
import vn.io.naherb.exception.AiUnavailableException;

@Service
@RequiredArgsConstructor
@Slf4j
public class KnowledgeIngestService {

    private final KnowledgeChunkRepository knowledgeChunkRepository;
    private final KnowledgeDocumentRepository knowledgeDocumentRepository;
    private final KnowledgeFileIngestor knowledgeFileIngestor;
    private final KnowledgeBootstrapService knowledgeBootstrapService;
    private final ChatbotProperties chatbotProperties;

    public void ingestDirectory(Path directory) {
        Path knowledgeRoot = directory.toAbsolutePath().normalize();
        if (!Files.isDirectory(knowledgeRoot)) {
            log.error(
                    "Thư mục knowledge không tồn tại: {} — kiểm tra CHATBOT_KNOWLEDGE_PATH và working directory của IDE",
                    knowledgeRoot);
            return;
        }

        reconcileBrokenIndexState();

        int ingested = 0;
        int skipped = 0;
        int failed = 0;

        try (Stream<Path> paths = Files.walk(knowledgeRoot)) {
            List<Path> markdownFiles = paths.filter(Files::isRegularFile)
                    .filter(path -> path.toString().toLowerCase(Locale.ROOT).endsWith(".md"))
                    .filter(path -> !isReadmeFile(path))
                    .sorted()
                    .toList();

            log.info("Tìm thấy {} file markdown trong {}", markdownFiles.size(), knowledgeRoot);

            for (int fileIndex = 0; fileIndex < markdownFiles.size(); fileIndex++) {
                Path file = markdownFiles.get(fileIndex);
                log.info(
                        "Đang xử lý knowledge ({}/{}): {}",
                        fileIndex + 1,
                        markdownFiles.size(),
                        knowledgeRoot.relativize(file.toAbsolutePath().normalize()));
                IngestOutcome outcome = ingestMarkdownFileSafe(knowledgeRoot, file);
                switch (outcome) {
                    case INGESTED -> ingested++;
                    case SKIPPED -> skipped++;
                    case FAILED -> failed++;
                }
            }
        } catch (IOException exception) {
            log.error("Không thể quét thư mục knowledge {}", knowledgeRoot, exception);
            return;
        }

        long totalChunks = knowledgeChunkRepository.countWithEmbeddings();
        log.info(
                "Hoàn tất ingest knowledge: ingested={}, skipped={}, failed={}, chunksWithEmbedding={}",
                ingested,
                skipped,
                failed,
                totalChunks);

        if (totalChunks == 0) {
            log.error(
                    "Không có chunk embedding nào trong DB sau ingest. Kiểm tra AI_API_KEY, mạng tới OpenAI, và đường dẫn {}",
                    knowledgeRoot);
        }

        logKnowledgeIndexSummary();
    }

    private void logKnowledgeIndexSummary() {
        for (KnowledgeDocument document : knowledgeDocumentRepository.findAll()) {
            long embedded = document.getId() != null
                    ? knowledgeChunkRepository.countEmbeddedChunksByDocumentId(document.getId())
                    : 0;
            log.info(
                    "Knowledge đã index: path={}, title={}, embeddings={}",
                    document.getSourcePath(),
                    document.getTitle(),
                    embedded);
        }
    }

    private void reconcileBrokenIndexState() {
        knowledgeBootstrapService.resetIndexIfNoEmbeddings();
    }

    public void ingestMarkdownFile(Path file) throws IOException {
        ingestMarkdownFile(resolveKnowledgeDirectory(), file);
    }

    public void ingestMarkdownFile(Path knowledgeRoot, Path file) throws IOException {
        ingestMarkdownFile(knowledgeRoot, file, KnowledgeSourceType.SEED);
    }

    public void ingestMarkdownFile(Path knowledgeRoot, Path file, KnowledgeSourceType sourceType)
            throws IOException {
        knowledgeFileIngestor.ingestMarkdownFile(knowledgeRoot, file, sourceType);
    }

    private IngestOutcome ingestMarkdownFileSafe(Path knowledgeRoot, Path file) {
        try {
            boolean changed = knowledgeFileIngestor.ingestMarkdownFile(knowledgeRoot, file);
            return changed ? IngestOutcome.INGESTED : IngestOutcome.SKIPPED;
        } catch (AiUnavailableException exception) {
            log.warn("Bỏ qua ingest {} vì AI không khả dụng: {}", file.getFileName(), exception.getMessage());
            return IngestOutcome.FAILED;
        } catch (IOException exception) {
            log.error("Lỗi đọc file knowledge {}", file, exception);
            return IngestOutcome.FAILED;
        }
    }

    private static boolean isReadmeFile(Path file) {
        return "readme.md".equalsIgnoreCase(file.getFileName().toString());
    }

    public Path resolveKnowledgeDirectory() {
        Path configured = Path.of(chatbotProperties.getKnowledgePath());
        if (configured.isAbsolute()) {
            return configured.normalize();
        }

        Path cwd = Path.of(System.getProperty("user.dir")).normalize();

        Path relativeToCwd = cwd.resolve(configured).normalize();
        if (Files.isDirectory(relativeToCwd)) {
            return relativeToCwd;
        }

        Path fromApiModule = cwd.resolve("..").resolve("content/chatbot-knowledge").normalize();
        if (Files.isDirectory(fromApiModule)) {
            return fromApiModule;
        }

        Path fromMonorepoRoot = cwd.resolve("content/chatbot-knowledge").normalize();
        if (Files.isDirectory(fromMonorepoRoot)) {
            return fromMonorepoRoot;
        }

        return relativeToCwd;
    }

    private enum IngestOutcome {
        INGESTED,
        SKIPPED,
        FAILED
    }
}
