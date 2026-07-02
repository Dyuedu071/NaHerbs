package vn.io.naherb.chatbot.dto;

import java.util.UUID;

public record ChatbotHistoryMessage(UUID id, String role, String content) {}
