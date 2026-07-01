package vn.io.naherb.chatbot.rag;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import vn.io.naherb.chatbot.config.ChatbotProperties;

class TextChunkingServiceTest {

    @Test
    void splitsBulletSectionsForBrandContent() {
        ChatbotProperties properties = new ChatbotProperties();
        properties.setChunkSize(800);
        properties.setChunkOverlap(120);
        TextChunkingService service = new TextChunkingService(properties);

        String markdown =
                """
                # Về NaHerbs

                Đoạn giới thiệu dài về thương hiệu NaHerbs.

                * Tầm nhìn
                Tầm nhìn của NaHerbs đến năm 2029.

                * Giá trị cốt lõi
                Giá trị cốt lõi của NaHerbs được xây dựng dựa trên mô hình 4R:
                Responsibility, Respectability, Renovation, Reliability.
                """;

        var chunks = service.chunkMarkdown(markdown);
        assertThat(chunks).anyMatch(chunk -> chunk.contains("mô hình 4R"));
    }
}
