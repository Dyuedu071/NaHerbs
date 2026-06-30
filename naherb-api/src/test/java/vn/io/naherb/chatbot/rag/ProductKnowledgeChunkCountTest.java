package vn.io.naherb.chatbot.rag;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import vn.io.naherb.chatbot.config.ChatbotProperties;

class ProductKnowledgeChunkCountTest {

    @Test
    void productFileProducesReasonableChunkCountAfterSanitization() throws Exception {
        Path productFile = Path.of("..", "content", "chatbot-knowledge", "Mô tả sản phẩm chi tiết NaHerbs.md")
                .normalize();
        if (!productFile.toFile().exists()) {
            return;
        }

        ChatbotProperties properties = new ChatbotProperties();
        properties.setChunkSize(800);
        properties.setChunkOverlap(120);
        TextChunkingService service = new TextChunkingService(properties);

        String raw = java.nio.file.Files.readString(productFile);
        var chunks = service.chunkMarkdown(raw);
        assertThat(chunks.size()).isLessThan(500);
        assertThat(chunks).anyMatch(chunk -> chunk.toLowerCase().contains("phiên bản"));
    }
}
