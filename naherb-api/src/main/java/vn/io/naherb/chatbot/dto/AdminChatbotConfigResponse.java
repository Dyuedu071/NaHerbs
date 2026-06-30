package vn.io.naherb.chatbot.dto;

import java.util.List;

public record AdminChatbotConfigResponse(
        boolean enabled,
        String welcomeMessage,
        String disclaimer,
        List<String> suggestedQuestions,
        String fallbackMessage) {}
