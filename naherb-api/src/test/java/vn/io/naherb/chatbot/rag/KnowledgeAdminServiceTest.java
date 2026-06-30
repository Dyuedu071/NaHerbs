package vn.io.naherb.chatbot.rag;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import vn.io.naherb.exception.BadRequestException;

class KnowledgeAdminServiceTest {

    @Test
    void sanitizeFileNameKeepsMarkdownExtension() {
        assertThat(KnowledgeAdminService.sanitizeFileName("huong-dan.md"))
                .isEqualTo("huong-dan.md");
    }

    @Test
    void sanitizeFileNameRejectsTraversal() {
        assertThatThrownBy(() -> KnowledgeAdminService.sanitizeFileName("../secret.md"))
                .isInstanceOf(BadRequestException.class);
    }
}
