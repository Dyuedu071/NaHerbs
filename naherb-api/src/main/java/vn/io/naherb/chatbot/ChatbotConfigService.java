package vn.io.naherb.chatbot;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import vn.io.naherb.chatbot.dto.AdminChatbotConfigResponse;
import vn.io.naherb.chatbot.dto.PublicChatbotConfigResponse;
import vn.io.naherb.chatbot.dto.UpdateChatbotConfigRequest;
import vn.io.naherb.chatbot.repository.ChatbotConfigRepository;

@Service
@RequiredArgsConstructor
public class ChatbotConfigService {

    private static final List<String> DEFAULT_SUGGESTIONS = List.of(
            "Gối thảo dược NaHerbs phù hợp với ai?",
            "Sản phẩm nào hỗ trợ thư giãn cổ vai gáy?",
            "Cách sử dụng túi chườm đa năng thế nào?");

    private final ChatbotConfigRepository chatbotConfigRepository;
    private final ObjectMapper objectMapper;

    @PostConstruct
    @Transactional
    public void ensureDefaults() {
        putDefault(ChatbotConfigKeys.ENABLED, "true", "Bật/tắt chatbot");
        putDefault(
                ChatbotConfigKeys.WELCOME_MESSAGE,
                "Xin chào! Tôi là trợ lý NaHerbs. Bạn cần tư vấn sản phẩm thảo dược nào?",
                "Lời chào");
        putDefault(
                ChatbotConfigKeys.DISCLAIMER,
                "Thông tin từ chatbot chỉ mang tính tham khảo, không thay thế tư vấn y khoa.",
                "Disclaimer sức khỏe");
        putDefault(
                ChatbotConfigKeys.FALLBACK_MESSAGE,
                "Hiện tôi chưa thể trả lời. Vui lòng thử lại sau hoặc liên hệ hotline NaHerbs.",
                "Fallback khi AI lỗi");
        if (chatbotConfigRepository.findByConfigKey(ChatbotConfigKeys.SUGGESTED_QUESTIONS).isEmpty()) {
            ChatbotConfig config = new ChatbotConfig();
            config.setConfigKey(ChatbotConfigKeys.SUGGESTED_QUESTIONS);
            config.setConfigValue(writeJson(DEFAULT_SUGGESTIONS));
            config.setDescription("Gợi ý câu hỏi");
            chatbotConfigRepository.save(config);
        }
    }

    @Transactional(readOnly = true)
    public PublicChatbotConfigResponse getPublicConfig() {
        return new PublicChatbotConfigResponse(
                getBoolean(ChatbotConfigKeys.ENABLED, true),
                getString(ChatbotConfigKeys.WELCOME_MESSAGE, ""),
                getString(ChatbotConfigKeys.DISCLAIMER, ""),
                getSuggestedQuestions());
    }

    @Transactional(readOnly = true)
    public AdminChatbotConfigResponse getAdminConfig() {
        return new AdminChatbotConfigResponse(
                getBoolean(ChatbotConfigKeys.ENABLED, true),
                getString(ChatbotConfigKeys.WELCOME_MESSAGE, ""),
                getString(ChatbotConfigKeys.DISCLAIMER, ""),
                getSuggestedQuestions(),
                getString(ChatbotConfigKeys.FALLBACK_MESSAGE, ""));
    }

    @Transactional
    public AdminChatbotConfigResponse updateAdminConfig(UpdateChatbotConfigRequest request) {
        if (request.enabled() != null) {
            upsert(ChatbotConfigKeys.ENABLED, String.valueOf(request.enabled()));
        }
        if (request.welcomeMessage() != null) {
            upsert(ChatbotConfigKeys.WELCOME_MESSAGE, request.welcomeMessage());
        }
        if (request.disclaimer() != null) {
            upsert(ChatbotConfigKeys.DISCLAIMER, request.disclaimer());
        }
        if (request.suggestedQuestions() != null) {
            upsert(ChatbotConfigKeys.SUGGESTED_QUESTIONS, writeJson(request.suggestedQuestions()));
        }
        if (request.fallbackMessage() != null) {
            upsert(ChatbotConfigKeys.FALLBACK_MESSAGE, request.fallbackMessage());
        }
        return getAdminConfig();
    }

    public boolean isEnabled() {
        return getBoolean(ChatbotConfigKeys.ENABLED, true);
    }

    public String getDisclaimer() {
        return getString(ChatbotConfigKeys.DISCLAIMER, "");
    }

    public String getFallbackMessage() {
        return getString(ChatbotConfigKeys.FALLBACK_MESSAGE, "Hiện tôi chưa thể trả lời. Vui lòng thử lại sau.");
    }

    private void putDefault(String key, String value, String description) {
        if (chatbotConfigRepository.findByConfigKey(key).isEmpty()) {
            ChatbotConfig config = new ChatbotConfig();
            config.setConfigKey(key);
            config.setConfigValue(value);
            config.setDescription(description);
            chatbotConfigRepository.save(config);
        }
    }

    private void upsert(String key, String value) {
        ChatbotConfig config = chatbotConfigRepository
                .findByConfigKey(key)
                .orElseGet(() -> {
                    ChatbotConfig created = new ChatbotConfig();
                    created.setConfigKey(key);
                    return created;
                });
        config.setConfigValue(value);
        chatbotConfigRepository.save(config);
    }

    private String getString(String key, String defaultValue) {
        return chatbotConfigRepository
                .findByConfigKey(key)
                .map(ChatbotConfig::getConfigValue)
                .filter(StringUtils::hasText)
                .orElse(defaultValue);
    }

    private boolean getBoolean(String key, boolean defaultValue) {
        return chatbotConfigRepository
                .findByConfigKey(key)
                .map(ChatbotConfig::getConfigValue)
                .map(Boolean::parseBoolean)
                .orElse(defaultValue);
    }

    private List<String> getSuggestedQuestions() {
        return chatbotConfigRepository
                .findByConfigKey(ChatbotConfigKeys.SUGGESTED_QUESTIONS)
                .map(ChatbotConfig::getConfigValue)
                .map(this::readSuggestions)
                .orElse(DEFAULT_SUGGESTIONS);
    }

    private List<String> readSuggestions(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException exception) {
            return DEFAULT_SUGGESTIONS;
        }
    }

    private String writeJson(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Không thể serialize suggested questions", exception);
        }
    }
}
