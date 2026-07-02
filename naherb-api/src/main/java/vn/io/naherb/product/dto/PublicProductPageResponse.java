package vn.io.naherb.product.dto;

import java.util.List;

public record PublicProductPageResponse(
        List<PublicProductSummaryResponse> items,
        int page,
        int size,
        long totalItems,
        int totalPages) {}
