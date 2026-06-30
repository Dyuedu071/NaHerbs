package vn.io.naherb.chatbot;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.chatbot.dto.ChatbotMessageRequest;
import vn.io.naherb.chatbot.dto.ChatbotMessageResponse;
import vn.io.naherb.chatbot.repository.ChatbotConversationRepository;
import vn.io.naherb.chatbot.repository.ChatbotMessageRepository;
import vn.io.naherb.common.enums.ChatSenderType;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.security.CurrentAccountHelper;

@Service
@RequiredArgsConstructor
class ChatbotExchangePersistence {

    private final ChatbotConversationRepository conversationRepository;
    private final ChatbotMessageRepository messageRepository;
    private final AccountRepository accountRepository;
    private final ChatbotConfigService chatbotConfigService;
    private final ObjectMapper objectMapper;

    @Transactional
    public UUID ensureConversation(ChatbotMessageRequest request, JwtAuthenticationToken authentication) {
        return resolveConversation(request, authentication).getId();
    }

    @Transactional
    public ChatbotMessageResponse appendExchange(
            UUID conversationId, ChatbotMessageRequest request, String answer) {
        ChatbotConversation conversation = conversationRepository
                .findById(conversationId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hội thoại"));

        String metadata = writeMetadata(request.sourcePage());
        saveMessage(conversation, ChatSenderType.USER, request.message().trim(), null);
        saveMessage(conversation, ChatSenderType.ASSISTANT, answer, metadata);

        return new ChatbotMessageResponse(
                conversation.getId(),
                answer,
                chatbotConfigService.getDisclaimer(),
                List.of(),
                List.of());
    }

    private ChatbotConversation resolveConversation(
            ChatbotMessageRequest request, JwtAuthenticationToken authentication) {
        if (request.conversationId() != null) {
            String sessionId = StringUtils.hasText(request.sessionId()) ? request.sessionId().trim() : null;
            ChatbotConversation conversation = conversationRepository
                    .findById(request.conversationId())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy hội thoại"));
            if (sessionId != null && !sessionId.equals(conversation.getSessionId())) {
                throw new NotFoundException("Không tìm thấy hội thoại");
            }
            return conversation;
        }

        String sessionId = StringUtils.hasText(request.sessionId())
                ? request.sessionId().trim()
                : UUID.randomUUID().toString();
        ChatbotConversation conversation = new ChatbotConversation(sessionId);
        resolveAccount(authentication).ifPresent(conversation::setAccount);
        return conversationRepository.save(conversation);
    }

    private void saveMessage(
            ChatbotConversation conversation, ChatSenderType senderType, String content, String metadata) {
        ChatbotMessage message = new ChatbotMessage();
        message.setConversation(conversation);
        message.setSenderType(senderType);
        message.setContent(content);
        message.setMetadata(metadata);
        messageRepository.save(message);
    }

    private java.util.Optional<Account> resolveAccount(JwtAuthenticationToken authentication) {
        if (authentication == null) {
            return java.util.Optional.empty();
        }
        return accountRepository.findByEmailIgnoreCase(
                CurrentAccountHelper.requireAccountEmail(authentication));
    }

    private String writeMetadata(String sourcePage) {
        if (!StringUtils.hasText(sourcePage)) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(java.util.Map.of("sourcePage", sourcePage));
        } catch (JsonProcessingException exception) {
            return null;
        }
    }
}
