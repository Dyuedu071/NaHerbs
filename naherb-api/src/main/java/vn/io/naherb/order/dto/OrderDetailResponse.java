package vn.io.naherb.order.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import vn.io.naherb.common.enums.OrderStatus;
import vn.io.naherb.common.enums.PaymentMethod;
import vn.io.naherb.common.enums.PaymentStatus;

public record OrderDetailResponse(
        UUID id,
        String orderCode,
        OrderStatus orderStatus,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        BigDecimal totalAmount,
        Instant createdAt,
        String note,
        List<OrderItemResponse> items,
        QrInstructionResponse qrInstruction,
        ShippingAddressSnapshotResponse shippingAddress) {}
