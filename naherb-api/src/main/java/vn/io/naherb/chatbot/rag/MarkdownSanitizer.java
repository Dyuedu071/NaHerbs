package vn.io.naherb.chatbot.rag;

import java.util.regex.Pattern;

final class MarkdownSanitizer {

    private static final Pattern IMAGE_PLACEHOLDER = Pattern.compile("!\\[\\]\\[[^\\]]+\\]");
    private static final Pattern IMAGE_REF_DATA_URI =
            Pattern.compile("\\[[^\\]]+\\]:\\s*<data:image[^>]+>", Pattern.CASE_INSENSITIVE);
    private static final Pattern INLINE_DATA_URI =
            Pattern.compile("data:image/[^;\\s]+;base64,[A-Za-z0-9+/=\\s]+", Pattern.CASE_INSENSITIVE);

    private MarkdownSanitizer() {}

    static String forKnowledgeIndex(String markdown) {
        if (markdown == null || markdown.isBlank()) {
            return "";
        }
        String stripped = IMAGE_PLACEHOLDER.matcher(markdown).replaceAll("");
        stripped = IMAGE_REF_DATA_URI.matcher(stripped).replaceAll("");
        stripped = INLINE_DATA_URI.matcher(stripped).replaceAll("");
        return stripped.trim();
    }
}
