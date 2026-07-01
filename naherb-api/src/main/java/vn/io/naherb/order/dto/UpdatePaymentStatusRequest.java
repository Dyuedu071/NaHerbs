package vn.io.naherb.order.dto;

import jakarta.validation.constraints.NotNull;
import vn.io.naherb.common.enums.PaymentStatus;

public record UpdatePaymentStatusRequest(@NotNull PaymentStatus paymentStatus, String note) {}
