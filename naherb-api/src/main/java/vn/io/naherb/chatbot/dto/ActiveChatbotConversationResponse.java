package vn.io.naherb.chatbot.dto;

import java.util.List;
import java.util.UUID;

public record ActiveChatbotConversationResponse(
        UUID conversationId, String sessionId, List<ChatbotHistoryMessage> messages) {}
