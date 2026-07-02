package vn.io.naherb.chatbot.dto;

import java.util.List;

public record ChatbotFaqEntry(String question, String answer, List<String> keywords) {}
