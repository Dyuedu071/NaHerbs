package vn.io.naherb.chatbot.dto;

import java.util.List;

public record PublicChatbotConfigResponse(
        boolean enabled,
        String welcomeMessage,
        String disclaimer,
        List<String> suggestedQuestions) {}
