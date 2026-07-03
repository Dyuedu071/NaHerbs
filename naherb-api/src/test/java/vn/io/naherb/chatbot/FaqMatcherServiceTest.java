package vn.io.naherb.chatbot;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import vn.io.naherb.InMemoryTokenStoreTestConfig;
import vn.io.naherb.MockOpenAiTestConfig;
import vn.io.naherb.chatbot.dto.ChatbotFaqEntry;
import vn.io.naherb.chatbot.dto.UpdateChatbotConfigRequest;
import vn.io.naherb.chatbot.faq.FaqMatcherService;
import vn.io.naherb.chatbot.repository.ChatbotConfigRepository;

@SpringBootTest
@Import({InMemoryTokenStoreTestConfig.class, MockOpenAiTestConfig.class})
class FaqMatcherServiceTest {

    @Autowired
    private FaqMatcherService faqMatcherService;

    @Autowired
    private ChatbotConfigService chatbotConfigService;

    @Autowired
    private ChatbotConfigRepository chatbotConfigRepository;

    @BeforeEach
    void setUp() {
        chatbotConfigRepository.deleteAll();
        chatbotConfigService.ensureDefaults();
    }

    @Test
    void matchesShippingQuestion() {
        var match = faqMatcherService.match("NaHerbs có ship toàn quốc không?");
        assertThat(match).isPresent();
        assertThat(match.get().answer()).contains("giao hàng");
    }

    @Test
    void matchesConfiguredFaqByKeyword() {
        chatbotConfigService.updateAdminConfig(new UpdateChatbotConfigRequest(
                null,
                null,
                null,
                null,
                null,
                List.of(new ChatbotFaqEntry(
                        "Chính sách đổi trả?",
                        "NaHerbs hỗ trợ đổi trả trong 7 ngày nếu sản phẩm còn nguyên tem.",
                        List.of("đổi trả", "hoàn hàng"))),
                null));

        var match = faqMatcherService.match("Cho mình hỏi chính sách đổi trả");
        assertThat(match).isPresent();
        assertThat(match.get().answer()).contains("7 ngày");
    }
}
