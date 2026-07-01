package vn.io.naherb.chatbot.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record ChatbotMessageRequest(
        UUID conversationId, String sessionId, @NotBlank String message, String sourcePage) {}
