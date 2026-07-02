package vn.io.naherb.chatbot;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Executor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import vn.io.naherb.chatbot.ai.OpenAiClient;
import vn.io.naherb.chatbot.dto.ChatbotMessageRequest;
import vn.io.naherb.chatbot.dto.RecommendedProductResponse;
import vn.io.naherb.chatbot.faq.FaqMatcherService;
import vn.io.naherb.chatbot.faq.FaqMatcherService.FaqMatch;
import vn.io.naherb.chatbot.guardrail.GuardrailService;
import vn.io.naherb.chatbot.rag.KnowledgeBootstrapService;
import vn.io.naherb.chatbot.rag.RagRetrievalService;
import vn.io.naherb.chatbot.rag.RagRetrievalService.RetrievedChunk;
import vn.io.naherb.exception.AiUnavailableException;
import vn.io.naherb.exception.BadRequestException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotStreamService {

    private final ChatbotConfigService chatbotConfigService;
    private final ChatbotExchangePersistence exchangePersistence;
    private final KnowledgeBootstrapService knowledgeBootstrapService;
    private final RagRetrievalService ragRetrievalService;
    private final ChatbotPromptBuilder chatbotPromptBuilder;
    private final FaqMatcherService faqMatcherService;
    private final OpenAiClient openAiClient;
    private final GuardrailService guardrailService;
    private final ObjectMapper objectMapper;
    private final Executor chatbotStreamExecutor;

    public SseEmitter streamMessage(ChatbotMessageRequest request, JwtAuthenticationToken authentication) {
        if (!chatbotConfigService.isEnabled()) {
            throw new BadRequestException("Chatbot hiện đang tắt");
        }

        SseEmitter emitter = new SseEmitter(120_000L);
        emitter.onTimeout(emitter::complete);
        emitter.onError(error -> log.warn("Chatbot SSE lỗi: {}", error.getMessage()));
        chatbotStreamExecutor.execute(() -> handleStream(request, authentication, emitter));
        return emitter;
    }

    private void handleStream(
            ChatbotMessageRequest request, JwtAuthenticationToken authentication, SseEmitter emitter) {
        try {
            knowledgeBootstrapService.ensureIndexedIfEmpty();
            UUID conversationId = exchangePersistence.ensureConversation(request, authentication);
            String userMessage = request.message().trim();

            sendEvent(emitter, "meta", Map.of("conversationId", conversationId));

            FaqMatch faqMatch = faqMatcherService.match(userMessage).orElse(null);
            if (faqMatch != null) {
                streamFaqAnswer(emitter, faqMatch.answer());
                finishExchange(emitter, conversationId, request, faqMatch.answer(), List.of());
                return;
            }

            List<RetrievedChunk> chunks = ragRetrievalService.retrieve(userMessage);
            ChatbotPromptBuilder.PreparedChat prepared = chatbotPromptBuilder.prepare(conversationId, userMessage, chunks);
            sendEvent(
                    emitter,
                    "meta",
                    Map.of(
                            "conversationId",
                            conversationId,
                            "recommendedProducts",
                            prepared.recommendedProducts()));

            StringBuilder answerBuilder = new StringBuilder();
            try {
                openAiClient.chatStream(prepared.messages(), token -> {
                    answerBuilder.append(token);
                    try {
                        sendEvent(emitter, "token", Map.of("text", token));
                    } catch (IOException ioException) {
                        throw new IllegalStateException("Không thể stream token", ioException);
                    }
                });
            } catch (AiUnavailableException exception) {
                log.warn("AI stream không khả dụng: {}", exception.getMessage());
                String fallback = chatbotConfigService.getFallbackMessage();
                streamFaqAnswer(emitter, fallback);
                finishExchange(emitter, conversationId, request, fallback, prepared.recommendedProducts());
                return;
            }

            String answer = guardrailService.sanitize(answerBuilder.toString().trim());
            if (!StringUtils.hasText(answer)) {
                answer = chatbotConfigService.getFallbackMessage();
            }
            finishExchange(emitter, conversationId, request, answer, prepared.recommendedProducts());
        } catch (Exception exception) {
            log.warn("Chatbot stream lỗi: {}", exception.getMessage());
            try {
                sendEvent(emitter, "error", Map.of("message", "Không thể xử lý tin nhắn. Vui lòng thử lại."));
            } catch (IOException ignored) {
                // emitter already broken
            }
            emitter.completeWithError(exception);
        }
    }

    private void streamFaqAnswer(SseEmitter emitter, String answer) throws IOException {
        for (String chunk : chunkText(answer, 24)) {
            sendEvent(emitter, "token", Map.of("text", chunk));
        }
    }

    private void finishExchange(
            SseEmitter emitter,
            UUID conversationId,
            ChatbotMessageRequest request,
            String answer,
            List<RecommendedProductResponse> products)
            throws IOException {
        exchangePersistence.appendExchange(conversationId, request, answer, products);
        Map<String, Object> donePayload = new LinkedHashMap<>();
        donePayload.put("conversationId", conversationId);
        donePayload.put("answer", answer);
        donePayload.put("disclaimer", chatbotConfigService.getDisclaimer());
        donePayload.put("recommendedProducts", products);
        sendEvent(emitter, "done", donePayload);
        emitter.complete();
    }

    private void sendEvent(SseEmitter emitter, String eventName, Object payload) throws IOException {
        emitter.send(SseEmitter.event().name(eventName).data(objectMapper.writeValueAsString(payload)));
    }

    private List<String> chunkText(String text, int chunkSize) {
        if (!StringUtils.hasText(text)) {
            return List.of();
        }
        List<String> chunks = new java.util.ArrayList<>();
        for (int index = 0; index < text.length(); index += chunkSize) {
            chunks.add(text.substring(index, Math.min(text.length(), index + chunkSize)));
        }
        return chunks;
    }
}
