package vn.io.naherb.order.dto;

import java.util.List;

public record OrderPageResponse(
        List<OrderSummaryResponse> items,
        int page,
        int size,
        long totalItems,
        int totalPages) {}
