package vn.io.naherb.product.dto;

import java.math.BigDecimal;
import java.util.UUID;
import vn.io.naherb.common.enums.StockStatus;

public record PublicProductSummaryResponse(
        UUID id,
        String name,
        String slug,
        String thumbnailUrl,
        String shortDescription,
        BigDecimal minSalePrice,
        BigDecimal maxSalePrice,
        StockStatus stockStatus) {}
