package vn.io.naherb.chatbot;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import vn.io.naherb.chatbot.ai.OpenAiClient;
import vn.io.naherb.chatbot.dto.RecommendedProductResponse;
import vn.io.naherb.chatbot.rag.RagRetrievalService;
import vn.io.naherb.chatbot.rag.RagRetrievalService.RetrievedChunk;
import vn.io.naherb.chatbot.repository.ChatbotMessageRepository;
import vn.io.naherb.chatbot.retrieval.PriceRankingQuery;
import vn.io.naherb.chatbot.retrieval.PriceSort;
import vn.io.naherb.chatbot.retrieval.ProductChatIntent;
import vn.io.naherb.chatbot.retrieval.ProductRetrievalService;
import vn.io.naherb.common.enums.ChatSenderType;

@Component
@RequiredArgsConstructor
public class ChatbotPromptBuilder {

    private static final String SYSTEM_PROMPT = """
            Bạn là trợ lý tư vấn sản phẩm NaHerbs (thảo dược, chăm sóc sức khỏe).
            Chỉ trả lời dựa trên CONTEXT được cung cấp.
            Không chẩn đoán bệnh, không kê đơn, không cam kết chữa bệnh.
            Không bịa giá, tồn kho hay tên sản phẩm ngoài CONTEXT.
            Giá sản phẩm chỉ lấy từ SẢN PHẨM TỪ HỆ THỐNG hoặc GIÁ SẢN PHẨM TỪ HỆ THỐNG; bỏ qua giá trong markdown knowledge.
            Nếu CONTEXT có THỐNG KÊ SẢN PHẨM, hãy nêu đúng tổng số sản phẩm và liệt kê vài sản phẩm tiêu biểu từ đó.
            Nếu CONTEXT có SẢN PHẨM TỪ HỆ THỐNG, ưu tiên gợi ý đúng các sản phẩm trong danh sách đó.
            Nếu thiếu thông tin, nói rõ và gợi ý liên hệ NaHerbs.
            Trả lời ngắn gọn, thân thiện, bằng tiếng Việt.
            """;

    private final ChatbotMessageRepository messageRepository;
    private final ProductRetrievalService productRetrievalService;

    public PreparedChat prepare(UUID conversationId, String userMessage, List<RetrievedChunk> ragChunks) {
        ProductChatIntent intent = productRetrievalService.detectIntent(userMessage);
        List<RecommendedProductResponse> products = List.of();
        String productContext = switch (intent) {
            case CATALOG_OVERVIEW -> productRetrievalService.buildCatalogOverviewContext();
            case PRICE_RANKING -> {
                PriceRankingQuery query = productRetrievalService
                        .resolvePriceRanking(userMessage)
                        .orElse(new PriceRankingQuery(PriceSort.CHEAPEST, 3));
                products = productRetrievalService.getProductsByPriceRank(query);
                yield productRetrievalService.buildPriceRankingContext(query);
            }
            case PRODUCT_SEARCH -> {
                products = productRetrievalService.searchForChatbot(userMessage);
                yield productRetrievalService.buildProductContext(products);
            }
            case NONE -> "";
        };

        String ragContext = buildRagContext(ragChunks);
        List<OpenAiClient.ChatMessage> messages =
                buildMessages(conversationId, ragContext, productContext, userMessage);
        return new PreparedChat(messages, products, ragContext, productContext);
    }

    public List<OpenAiClient.ChatMessage> buildMessages(
            UUID conversationId, String ragContext, String productContext, String userMessage) {
        List<OpenAiClient.ChatMessage> messages = new ArrayList<>();
        messages.add(new OpenAiClient.ChatMessage("system", SYSTEM_PROMPT));
        if (StringUtils.hasText(ragContext)) {
            messages.add(new OpenAiClient.ChatMessage(
                    "system", "CONTEXT (chỉ dùng thông tin dưới đây):\n" + ragContext));
        }
        if (StringUtils.hasText(productContext)) {
            messages.add(new OpenAiClient.ChatMessage("system", productContext));
        }
        List<ChatbotMessage> history = new ArrayList<>(
                messageRepository.findTop10ByConversation_IdOrderByCreatedAtDesc(conversationId));
        Collections.reverse(history);
        for (ChatbotMessage pastMessage : history) {
            if (pastMessage.getSenderType() == ChatSenderType.USER) {
                messages.add(new OpenAiClient.ChatMessage("user", pastMessage.getContent()));
            } else if (pastMessage.getSenderType() == ChatSenderType.ASSISTANT) {
                messages.add(new OpenAiClient.ChatMessage("assistant", pastMessage.getContent()));
            }
        }
        messages.add(new OpenAiClient.ChatMessage("user", userMessage));
        return messages;
    }

    private String buildRagContext(List<RetrievedChunk> chunks) {
        if (chunks == null || chunks.isEmpty()) {
            return "";
        }
        StringBuilder builder = new StringBuilder();
        int index = 1;
        for (RetrievedChunk chunk : chunks) {
            builder.append("--- Chunk ")
                    .append(index++)
                    .append(" (")
                    .append(chunk.documentTitle())
                    .append(") ---\n")
                    .append(chunk.content())
                    .append("\n\n");
        }
        return builder.toString().trim();
    }

    public record PreparedChat(
            List<OpenAiClient.ChatMessage> messages,
            List<RecommendedProductResponse> recommendedProducts,
            String ragContext,
            String productContext) {}
}
