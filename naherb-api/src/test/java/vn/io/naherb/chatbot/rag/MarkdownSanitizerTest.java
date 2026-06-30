package vn.io.naherb.chatbot.rag;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class MarkdownSanitizerTest {

    @Test
    void stripsBase64ImageReferences() {
        String markdown =
                """
                # Sản phẩm

                Mô tả ngắn về gối công thái học.

                ![][image1]

                [image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==>
                """;

        String sanitized = MarkdownSanitizer.forKnowledgeIndex(markdown);
        assertThat(sanitized).contains("gối công thái học");
        assertThat(sanitized).doesNotContain("base64");
        assertThat(sanitized).doesNotContain("image1");
    }
}
