package vn.io.naherb.cart.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record CartItemResponse(
        UUID id,
        UUID skuId,
        String productName,
        String productSlug,
        String skuName,
        String thumbnailUrl,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal lineTotal,
        Integer stockQuantity) {}
