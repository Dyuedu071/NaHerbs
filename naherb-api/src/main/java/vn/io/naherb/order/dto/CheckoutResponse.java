package vn.io.naherb.order.dto;

import java.math.BigDecimal;
import java.util.UUID;
import vn.io.naherb.common.enums.OrderStatus;
import vn.io.naherb.common.enums.PaymentMethod;
import vn.io.naherb.common.enums.PaymentStatus;

public record CheckoutResponse(
        UUID orderId,
        String orderCode,
        OrderStatus orderStatus,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        BigDecimal totalAmount,
        QrInstructionResponse qrInstruction) {}
