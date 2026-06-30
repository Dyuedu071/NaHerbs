package vn.io.naherb.chatbot.dto;

import java.util.List;
import java.util.UUID;

public record ChatbotMessageResponse(
        UUID conversationId,
        String answer,
        String disclaimer,
        List<RecommendedProductResponse> recommendedProducts,
        List<SuggestedActionResponse> suggestedActions) {}
