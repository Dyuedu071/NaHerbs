package vn.io.naherb.product.dto;

import java.math.BigDecimal;
import java.util.UUID;
import vn.io.naherb.common.enums.SkuStatus;
import vn.io.naherb.common.enums.StockStatus;

public record PublicProductSkuResponse(
        UUID id,
        String skuCode,
        String name,
        String color,
        String scent,
        String type,
        BigDecimal originalPrice,
        BigDecimal salePrice,
        Integer stockQuantity,
        StockStatus stockStatus,
        SkuStatus status,
        String thumbnailUrl) {}
