package vn.io.naherb.chatbot.rag;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.io.naherb.chatbot.config.ChatbotProperties;
import vn.io.naherb.chatbot.dto.KnowledgeDocumentSummaryResponse;
import vn.io.naherb.chatbot.dto.KnowledgeUploadResponse;
import vn.io.naherb.exception.BadRequestException;
import vn.io.naherb.exception.NotFoundException;

@Service
@RequiredArgsConstructor
@Slf4j
public class KnowledgeAdminService {

    private static final Charset UPLOAD_CHARSET = StandardCharsets.UTF_8;

    private final KnowledgeIngestService knowledgeIngestService;
    private final KnowledgeDocumentRepository knowledgeDocumentRepository;
    private final KnowledgeChunkRepository knowledgeChunkRepository;
    private final ChatbotProperties chatbotProperties;

    public List<KnowledgeDocumentSummaryResponse> listDocuments() {
        Path knowledgeRoot = knowledgeIngestService.resolveKnowledgeDirectory();
        if (!Files.isDirectory(knowledgeRoot)) {
            return List.of();
        }

        Map<String, KnowledgeDocument> documentsByPath = knowledgeDocumentRepository.findAll().stream()
                .filter(document -> document.getSourcePath() != null)
                .collect(Collectors.toMap(KnowledgeDocument::getSourcePath, Function.identity(), (a, b) -> a));

        List<KnowledgeDocumentSummaryResponse> summaries = new ArrayList<>();
        try (Stream<Path> paths = Files.list(knowledgeRoot)) {
            paths.filter(Files::isRegularFile)
                    .filter(this::isMarkdownFile)
                    .filter(path -> !isReadmeFile(path))
                    .forEach(file -> summaries.add(toSummary(knowledgeRoot, file, documentsByPath.get(relativePath(knowledgeRoot, file)))));
        } catch (IOException exception) {
            throw new BadRequestException("Không thể đọc thư mục knowledge: " + exception.getMessage());
        }

        summaries.sort(Comparator.comparing(KnowledgeDocumentSummaryResponse::fileName, String.CASE_INSENSITIVE_ORDER));
        return summaries;
    }

    public KnowledgeUploadResponse upload(MultipartFile file, boolean replace) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn file markdown để upload");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            throw new BadRequestException("Tên file không hợp lệ");
        }

        if (!isMarkdownFilename(originalName)) {
            throw new BadRequestException("Chỉ chấp nhận file .md (Markdown)");
        }

        if (file.getSize() > chatbotProperties.getKnowledgeMaxUploadBytes()) {
            throw new BadRequestException(
                    "File vượt quá dung lượng cho phép (%d MB)"
                            .formatted(chatbotProperties.getKnowledgeMaxUploadBytes() / (1024 * 1024)));
        }

        String content;
        try {
            content = new String(file.getBytes(), UPLOAD_CHARSET);
        } catch (IOException exception) {
            throw new BadRequestException("Không thể đọc nội dung file upload");
        }

        if (!StandardCharsets.UTF_8.newEncoder().canEncode(content)) {
            throw new BadRequestException("File phải mã hóa UTF-8");
        }

        Path knowledgeRoot = knowledgeIngestService.resolveKnowledgeDirectory();
        ensureDirectory(knowledgeRoot);

        String fileName = resolveTargetFileName(knowledgeRoot, sanitizeFileName(originalName), replace);
        Path target = knowledgeRoot.resolve(fileName).normalize();
        if (!target.startsWith(knowledgeRoot)) {
            throw new BadRequestException("Tên file không hợp lệ");
        }

        try {
            Files.writeString(target, content, UPLOAD_CHARSET);
        } catch (IOException exception) {
            throw new BadRequestException("Không thể lưu file knowledge: " + exception.getMessage());
        }

        String relativePath = relativePath(knowledgeRoot, target);
        startIngestAsync(knowledgeRoot, target, KnowledgeSourceType.UPLOAD);

        KnowledgeDocument document = knowledgeDocumentRepository.findBySourcePath(relativePath).orElse(null);
        KnowledgeDocumentSummaryResponse summary = toSummary(knowledgeRoot, target, document);
        return new KnowledgeUploadResponse(
                summary,
                true,
                "Đã lưu file và bắt đầu index nền. Chatbot sẽ dùng nội dung sau vài phút.");
    }

    @Transactional
    public void deleteBySourcePath(String sourcePath) {
        if (sourcePath == null || sourcePath.isBlank()) {
            throw new BadRequestException("sourcePath là bắt buộc");
        }
        if (sourcePath.contains("..") || sourcePath.contains("\\") || sourcePath.startsWith("/")) {
            throw new BadRequestException("sourcePath không hợp lệ");
        }

        Path knowledgeRoot = knowledgeIngestService.resolveKnowledgeDirectory();
        Path target = knowledgeRoot.resolve(sourcePath).normalize();
        if (!target.startsWith(knowledgeRoot)) {
            throw new BadRequestException("sourcePath không hợp lệ");
        }

        knowledgeDocumentRepository.findBySourcePath(sourcePath).ifPresent(document -> {
            if (document.getId() != null) {
                knowledgeChunkRepository.deleteByDocumentId(document.getId());
                knowledgeDocumentRepository.delete(document);
            }
        });

        try {
            if (Files.exists(target)) {
                Files.delete(target);
            }
        } catch (IOException exception) {
            throw new BadRequestException("Không thể xóa file knowledge: " + exception.getMessage());
        }
    }

    @Transactional
    public void deleteById(UUID documentId) {
        KnowledgeDocument document = knowledgeDocumentRepository
                .findById(documentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài liệu knowledge"));

        if (document.getSourcePath() != null) {
            deleteBySourcePath(document.getSourcePath());
            return;
        }

        if (document.getId() != null) {
            knowledgeChunkRepository.deleteByDocumentId(document.getId());
        }
        knowledgeDocumentRepository.delete(document);
    }

    private void startIngestAsync(Path knowledgeRoot, Path file, KnowledgeSourceType sourceType) {
        Thread ingestThread = new Thread(
                () -> {
                    try {
                        knowledgeIngestService.ingestMarkdownFile(knowledgeRoot, file, sourceType);
                    } catch (Exception exception) {
                        log.error("Ingest knowledge sau upload thất bại: {}", file.getFileName(), exception);
                    }
                },
                "knowledge-upload-ingest");
        ingestThread.setDaemon(true);
        ingestThread.start();
    }

    private KnowledgeDocumentSummaryResponse toSummary(
            Path knowledgeRoot, Path file, KnowledgeDocument document) {
        String relativePath = relativePath(knowledgeRoot, file);
        long embeddedChunkCount = 0;
        long chunkCount = 0;
        UUID id = null;
        String title = extractTitleFromFile(file);
        KnowledgeSourceType sourceType = KnowledgeSourceType.SEED;
        KnowledgeDocumentStatus status = KnowledgeDocumentStatus.PUBLISHED;
        Instant indexedAt = null;

        if (document != null) {
            id = document.getId();
            title = document.getTitle() != null ? document.getTitle() : title;
            sourceType = document.getSourceType();
            status = document.getStatus();
            indexedAt = document.getIndexedAt();
            if (document.getId() != null) {
                chunkCount = knowledgeChunkRepository.countByDocumentId(document.getId());
                embeddedChunkCount = knowledgeChunkRepository.countEmbeddedChunksByDocumentId(document.getId());
            }
        }

        Long fileSizeBytes = null;
        Instant lastModifiedAt = null;
        try {
            if (Files.exists(file)) {
                fileSizeBytes = Files.size(file);
                lastModifiedAt = Files.getLastModifiedTime(file).toInstant();
            }
        } catch (IOException exception) {
            log.debug("Không đọc được metadata file {}", file, exception);
        }

        return new KnowledgeDocumentSummaryResponse(
                id,
                file.getFileName().toString(),
                relativePath,
                title,
                sourceType,
                status,
                chunkCount,
                embeddedChunkCount,
                indexedAt,
                fileSizeBytes,
                lastModifiedAt);
    }

    private static String relativePath(Path knowledgeRoot, Path file) {
        return knowledgeRoot.relativize(file.toAbsolutePath().normalize()).toString().replace('\\', '/');
    }

    private static void ensureDirectory(Path knowledgeRoot) {
        try {
            Files.createDirectories(knowledgeRoot);
        } catch (IOException exception) {
            throw new BadRequestException("Không thể tạo thư mục knowledge: " + exception.getMessage());
        }
    }

    private static String extractTitleFromFile(Path file) {
        try {
            String firstLine = Files.lines(file, UPLOAD_CHARSET)
                    .map(String::trim)
                    .filter(line -> line.startsWith("# "))
                    .findFirst()
                    .orElse(file.getFileName().toString());
            return firstLine.startsWith("# ") ? firstLine.substring(2).trim() : firstLine;
        } catch (IOException exception) {
            return file.getFileName().toString();
        }
    }

    private String resolveTargetFileName(Path knowledgeRoot, String sanitizedName, boolean replace) {
        Path target = knowledgeRoot.resolve(sanitizedName);
        if (!Files.exists(target) || replace) {
            return sanitizedName;
        }

        int dotIndex = sanitizedName.lastIndexOf('.');
        String base = dotIndex > 0 ? sanitizedName.substring(0, dotIndex) : sanitizedName;
        String extension = dotIndex > 0 ? sanitizedName.substring(dotIndex) : ".md";
        String timestamp = String.valueOf(System.currentTimeMillis());
        return base + "-" + timestamp + extension;
    }

    static String sanitizeFileName(String originalName) {
        if (originalName.contains("..") || originalName.contains("/") || originalName.contains("\\")) {
            throw new BadRequestException("Tên file không hợp lệ");
        }
        String name = Path.of(originalName).getFileName().toString().trim();
        if (name.isBlank()) {
            throw new BadRequestException("Tên file không hợp lệ");
        }
        name = name.replace('\\', '-').replace('/', '-');
        if (!name.toLowerCase(Locale.ROOT).endsWith(".md")) {
            name = name + ".md";
        }
        return name;
    }

    private boolean isMarkdownFile(Path file) {
        return isMarkdownFilename(file.getFileName().toString());
    }

    private static boolean isMarkdownFilename(String fileName) {
        return fileName != null && fileName.toLowerCase(Locale.ROOT).endsWith(".md");
    }

    private static boolean isReadmeFile(Path file) {
        return "readme.md".equalsIgnoreCase(file.getFileName().toString());
    }
}
