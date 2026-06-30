package vn.io.naherb.chatbot.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import vn.io.naherb.chatbot.config.AiProperties;
import vn.io.naherb.chatbot.rag.KnowledgeChunkRepository;
import vn.io.naherb.exception.AiUnavailableException;

@Component
@RequiredArgsConstructor
@Slf4j
public class AiStartupDiagnostics {

    private final AiProperties aiProperties;
    private final OpenAiClient openAiClient;
    private final KnowledgeChunkRepository knowledgeChunkRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void verifyOpenAiOnStartup() {
        if (!StringUtils.hasText(aiProperties.getApiKey())) {
            log.error(
                    "AI_API_KEY chưa được cấu hình — chatbot sẽ luôn trả fallback. Thêm AI_API_KEY vào naherb-api/.env.backend");
            return;
        }

        log.info(
                "AI đã cấu hình: provider={}, model={}, embeddingModel={}",
                aiProperties.getProvider(),
                aiProperties.getModel(),
                aiProperties.getEmbeddingModel());

        try {
            openAiClient.embed("naherbs health check");
            long embeddedChunks = knowledgeChunkRepository.countWithEmbeddings();
            log.info("Kết nối OpenAI OK. knowledge_chunks có embedding: {}", embeddedChunks);
            if (embeddedChunks == 0) {
                log.warn(
                        "Chưa có knowledge chunk nào có embedding — đợi ingest nền hoàn tất hoặc kiểm tra CHATBOT_KNOWLEDGE_PATH");
            }
        } catch (AiUnavailableException exception) {
            log.error(
                    "Không kết nối được OpenAI — chatbot sẽ trả fallback. Chi tiết: {}. "
                            + "Kiểm tra API key, quota, và mạng tới {}",
                    exception.getMessage(),
                    aiProperties.getBaseUrl());
        }
    }
}
