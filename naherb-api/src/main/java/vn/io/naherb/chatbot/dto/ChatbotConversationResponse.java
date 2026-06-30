package vn.io.naherb.chatbot.dto;

import java.util.UUID;

public record ChatbotConversationResponse(UUID id, String sessionId, String status) {}
