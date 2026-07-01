package vn.io.naherb.chatbot;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.chatbot.ai.OpenAiClient;
import vn.io.naherb.chatbot.dto.ChatbotConversationResponse;
import vn.io.naherb.chatbot.dto.ChatbotMessageRequest;
import vn.io.naherb.chatbot.dto.ChatbotMessageResponse;
import vn.io.naherb.chatbot.dto.CreateConversationRequest;
import vn.io.naherb.chatbot.guardrail.GuardrailService;
import vn.io.naherb.chatbot.rag.KnowledgeBootstrapService;
import vn.io.naherb.chatbot.rag.RagRetrievalService;
import vn.io.naherb.chatbot.rag.RagRetrievalService.RetrievedChunk;
import vn.io.naherb.chatbot.repository.ChatbotConversationRepository;
import vn.io.naherb.chatbot.repository.ChatbotMessageRepository;
import vn.io.naherb.common.enums.ChatSenderType;
import vn.io.naherb.exception.AiUnavailableException;
import vn.io.naherb.exception.BadRequestException;
import vn.io.naherb.security.CurrentAccountHelper;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {

    private static final String SYSTEM_PROMPT = """
            Bạn là trợ lý tư vấn sản phẩm NaHerbs (thảo dược, chăm sóc sức khỏe).
            Chỉ trả lời dựa trên CONTEXT được cung cấp.
            Không chẩn đoán bệnh, không kê đơn, không cam kết chữa bệnh.
            Không bịa giá, tồn kho hay tên sản phẩm ngoài CONTEXT.
            Nếu thiếu thông tin, nói rõ và gợi ý liên hệ NaHerbs.
            Trả lời ngắn gọn, thân thiện, bằng tiếng Việt.
            """;

    private final ChatbotConfigService chatbotConfigService;
    private final ChatbotConversationRepository conversationRepository;
    private final ChatbotMessageRepository messageRepository;
    private final AccountRepository accountRepository;
    private final ChatbotExchangePersistence exchangePersistence;
    private final RagRetrievalService ragRetrievalService;
    private final KnowledgeBootstrapService knowledgeBootstrapService;
    private final OpenAiClient openAiClient;
    private final GuardrailService guardrailService;

    @Transactional
    public ChatbotConversationResponse createConversation(
            CreateConversationRequest request, JwtAuthenticationToken authentication) {
        String sessionId = StringUtils.hasText(request.sessionId())
                ? request.sessionId().trim()
                : UUID.randomUUID().toString();

        ChatbotConversation conversation = new ChatbotConversation(sessionId);
        resolveAccount(authentication).ifPresent(conversation::setAccount);
        conversation = conversationRepository.save(conversation);
        return toConversationResponse(conversation);
    }

    public ChatbotMessageResponse handleMessage(
            ChatbotMessageRequest request, JwtAuthenticationToken authentication) {
        if (!chatbotConfigService.isEnabled()) {
            throw new BadRequestException("Chatbot hiện đang tắt");
        }

        knowledgeBootstrapService.ensureIndexedIfEmpty();
        java.util.UUID conversationId = exchangePersistence.ensureConversation(request, authentication);

        String answer;
        try {
            List<RetrievedChunk> chunks = ragRetrievalService.retrieve(request.message());
            String context = buildContext(chunks);
            if (!StringUtils.hasText(context)) {
                log.warn(
                        "RAG trả về context rỗng cho câu hỏi: {} — kiểm tra knowledge_chunks đã ingest chưa",
                        request.message().trim());
            }
            List<OpenAiClient.ChatMessage> messages =
                    buildPrompt(conversationId, context, request.message().trim());
            answer = guardrailService.sanitize(openAiClient.chat(messages));
        } catch (AiUnavailableException exception) {
            log.warn("AI không khả dụng, trả fallback cho câu hỏi: {} — {}", request.message().trim(), exception.getMessage());
            answer = chatbotConfigService.getFallbackMessage();
        }

        return exchangePersistence.appendExchange(conversationId, request, answer);
    }

    private List<OpenAiClient.ChatMessage> buildPrompt(UUID conversationId, String context, String userMessage) {
        List<OpenAiClient.ChatMessage> messages = new ArrayList<>();
        messages.add(new OpenAiClient.ChatMessage("system", SYSTEM_PROMPT));
        if (StringUtils.hasText(context)) {
            messages.add(new OpenAiClient.ChatMessage(
                    "system", "CONTEXT (chỉ dùng thông tin dưới đây):\n" + context));
        }
        List<ChatbotMessage> history = new ArrayList<>(
                messageRepository.findTop10ByConversation_IdOrderByCreatedAtDesc(conversationId));
        Collections.reverse(history);
        for (ChatbotMessage pastMessage : history) {
            if (pastMessage.getSenderType() == ChatSenderType.USER) {
                messages.add(new OpenAiClient.ChatMessage("user", pastMessage.getContent()));
            } else if (pastMessage.getSenderType() == ChatSenderType.ASSISTANT) {
                messages.add(new OpenAiClient.ChatMessage("assistant", pastMessage.getContent()));
            }
        }
        messages.add(new OpenAiClient.ChatMessage("user", userMessage));
        return messages;
    }

    private String buildContext(List<RetrievedChunk> chunks) {
        if (chunks.isEmpty()) {
            return "";
        }
        StringBuilder builder = new StringBuilder();
        int index = 1;
        for (RetrievedChunk chunk : chunks) {
            builder.append("--- Chunk ")
                    .append(index++)
                    .append(" (")
                    .append(chunk.documentTitle())
                    .append(") ---\n")
                    .append(chunk.content())
                    .append("\n\n");
        }
        return builder.toString().trim();
    }

    private java.util.Optional<Account> resolveAccount(JwtAuthenticationToken authentication) {
        if (authentication == null) {
            return java.util.Optional.empty();
        }
        return accountRepository.findByEmailIgnoreCase(
                CurrentAccountHelper.requireAccountEmail(authentication));
    }

    private ChatbotConversationResponse toConversationResponse(ChatbotConversation conversation) {
        return new ChatbotConversationResponse(
                conversation.getId(),
                conversation.getSessionId(),
                conversation.getStatus().name());
    }
}
