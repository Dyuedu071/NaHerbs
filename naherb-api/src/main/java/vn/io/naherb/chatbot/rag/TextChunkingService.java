package vn.io.naherb.chatbot.rag;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;
import vn.io.naherb.chatbot.config.ChatbotProperties;

@Component
public class TextChunkingService {

    private static final Pattern HEADING_SPLIT = Pattern.compile("(?=^#\\s+)", Pattern.MULTILINE);
    private static final Pattern BULLET_SECTION_SPLIT =
            Pattern.compile("(?=^\\*\\s+\\S)", Pattern.MULTILINE);
    private final ChatbotProperties chatbotProperties;

    public TextChunkingService(ChatbotProperties chatbotProperties) {
        this.chatbotProperties = chatbotProperties;
    }

    public List<String> chunkMarkdown(String markdown) {
        String normalized = MarkdownSanitizer.forKnowledgeIndex(markdown);
        String[] sections = HEADING_SPLIT.split(normalized);
        List<String> chunks = new ArrayList<>();
        for (String section : sections) {
            String trimmed = section.trim();
            if (trimmed.isEmpty() || RagChunkSelector.shouldSkipKnowledgeSection(trimmed)) {
                continue;
            }
            if (trimmed.length() <= chatbotProperties.getChunkSize()) {
                chunks.add(trimmed);
                continue;
            }
            chunks.addAll(splitLargeSection(trimmed));
        }
        return chunks;
    }

    private List<String> splitLargeSection(String section) {
        String[] bulletSections = BULLET_SECTION_SPLIT.split(section);
        if (bulletSections.length > 1) {
            List<String> chunks = new ArrayList<>();
            for (String bulletSection : bulletSections) {
                String trimmed = bulletSection.trim();
                if (trimmed.isEmpty()) {
                    continue;
                }
                if (trimmed.length() <= chatbotProperties.getChunkSize()) {
                    chunks.add(trimmed);
                } else {
                    chunks.addAll(splitBySize(trimmed));
                }
            }
            return chunks;
        }
        return splitBySize(section);
    }

    private List<String> splitBySize(String text) {
        int chunkSize = chatbotProperties.getChunkSize();
        int overlap = chatbotProperties.getChunkOverlap();
        List<String> parts = new ArrayList<>();
        int start = 0;
        while (start < text.length()) {
            int end = Math.min(text.length(), start + chunkSize);
            if (end < text.length()) {
                int paragraphBreak = text.lastIndexOf("\n\n", end);
                if (paragraphBreak > start + chunkSize / 2) {
                    end = paragraphBreak;
                }
            }
            String piece = text.substring(start, end).trim();
            if (!piece.isEmpty()) {
                parts.add(piece);
            }
            if (end >= text.length()) {
                break;
            }
            start = Math.max(end - overlap, start + 1);
        }
        return parts;
    }
}
