package vn.io.naherb.chatbot.dto;

import java.util.List;

public record UpdateChatbotConfigRequest(
        Boolean enabled,
        String welcomeMessage,
        String disclaimer,
        List<String> suggestedQuestions,
        String fallbackMessage) {}
