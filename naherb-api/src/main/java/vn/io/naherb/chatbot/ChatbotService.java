package vn.io.naherb.chatbot;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.chatbot.ai.OpenAiClient;
import vn.io.naherb.chatbot.dto.ActiveChatbotConversationResponse;
import vn.io.naherb.chatbot.dto.ChatbotConversationResponse;
import vn.io.naherb.chatbot.dto.ChatbotHistoryMessage;
import vn.io.naherb.chatbot.dto.ChatbotMessageRequest;
import vn.io.naherb.chatbot.dto.ChatbotMessageResponse;
import vn.io.naherb.chatbot.dto.CreateConversationRequest;
import vn.io.naherb.chatbot.dto.RecommendedProductResponse;
import vn.io.naherb.chatbot.faq.FaqMatcherService;
import vn.io.naherb.chatbot.faq.FaqMatcherService.FaqMatch;
import vn.io.naherb.chatbot.guardrail.GuardrailService;
import vn.io.naherb.chatbot.rag.KnowledgeBootstrapService;
import vn.io.naherb.chatbot.rag.RagRetrievalService;
import vn.io.naherb.chatbot.rag.RagRetrievalService.RetrievedChunk;
import vn.io.naherb.chatbot.repository.ChatbotConversationRepository;
import vn.io.naherb.chatbot.repository.ChatbotMessageRepository;
import vn.io.naherb.common.enums.ChatConversationStatus;
import vn.io.naherb.common.enums.ChatSenderType;
import vn.io.naherb.exception.AiUnavailableException;
import vn.io.naherb.exception.BadRequestException;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.security.CurrentAccountHelper;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {

    private final ChatbotConfigService chatbotConfigService;
    private final ChatbotConversationRepository conversationRepository;
    private final ChatbotMessageRepository messageRepository;
    private final AccountRepository accountRepository;
    private final ChatbotExchangePersistence exchangePersistence;
    private final RagRetrievalService ragRetrievalService;
    private final KnowledgeBootstrapService knowledgeBootstrapService;
    private final ChatbotPromptBuilder chatbotPromptBuilder;
    private final FaqMatcherService faqMatcherService;
    private final OpenAiClient openAiClient;
    private final GuardrailService guardrailService;

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

    public ActiveChatbotConversationResponse getActiveConversation(JwtAuthenticationToken authentication) {
        Account account = resolveAccount(authentication)
                .orElseThrow(() -> new BadRequestException("Cần đăng nhập để xem lịch sử chatbot"));

        ChatbotConversation conversation = conversationRepository
                .findFirstByAccount_IdAndStatusOrderByUpdatedAtDesc(account.getId(), ChatConversationStatus.OPEN)
                .orElseThrow(() -> new NotFoundException("Chưa có hội thoại chatbot"));

        List<ChatbotHistoryMessage> messages = messageRepository
                .findByConversation_IdOrderByCreatedAtAsc(conversation.getId())
                .stream()
                .map(this::toHistoryMessage)
                .toList();

        return new ActiveChatbotConversationResponse(
                conversation.getId(), conversation.getSessionId(), messages);
    }

    public ChatbotMessageResponse handleMessage(
            ChatbotMessageRequest request, JwtAuthenticationToken authentication) {
        if (!chatbotConfigService.isEnabled()) {
            throw new BadRequestException("Chatbot hiện đang tắt");
        }

        knowledgeBootstrapService.ensureIndexedIfEmpty();
        UUID conversationId = exchangePersistence.ensureConversation(request, authentication);
        String userMessage = request.message().trim();

        FaqMatch faqMatch = faqMatcherService.match(userMessage).orElse(null);
        if (faqMatch != null) {
            return exchangePersistence.appendExchange(conversationId, request, faqMatch.answer(), List.of());
        }

        String answer;
        List<RecommendedProductResponse> products = List.of();
        try {
            List<RetrievedChunk> chunks = ragRetrievalService.retrieve(userMessage);
            ChatbotPromptBuilder.PreparedChat prepared = chatbotPromptBuilder.prepare(conversationId, userMessage, chunks);
            products = prepared.recommendedProducts();
            if (!StringUtils.hasText(prepared.ragContext()) && !StringUtils.hasText(prepared.productContext())) {
                log.warn(
                        "RAG và product context đều rỗng cho câu hỏi: {} — kiểm tra knowledge_chunks và products published",
                        userMessage);
            }
            answer = guardrailService.sanitize(openAiClient.chat(prepared.messages()));
        } catch (AiUnavailableException exception) {
            log.warn("AI không khả dụng, trả fallback cho câu hỏi: {} — {}", userMessage, exception.getMessage());
            answer = chatbotConfigService.getFallbackMessage();
        }

        return exchangePersistence.appendExchange(conversationId, request, answer, products);
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

    private ChatbotHistoryMessage toHistoryMessage(ChatbotMessage message) {
        String role = message.getSenderType() == ChatSenderType.USER ? "user" : "assistant";
        return new ChatbotHistoryMessage(message.getId(), role, message.getContent());
    }
}
