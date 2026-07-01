package vn.io.naherb.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(
        UUID id,
        UUID skuId,
        String productNameSnapshot,
        String skuNameSnapshot,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal lineTotal) {}
