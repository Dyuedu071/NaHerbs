package vn.io.naherb.chatbot.dto;

import java.util.UUID;
import vn.io.naherb.common.enums.StockStatus;

public record RecommendedProductResponse(
        UUID productId,
        UUID skuId,
        String name,
        String slug,
        String skuName,
        Long salePrice,
        StockStatus stockStatus,
        String thumbnailUrl,
        String reason) {}
