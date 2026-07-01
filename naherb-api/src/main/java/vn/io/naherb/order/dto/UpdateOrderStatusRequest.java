package vn.io.naherb.order.dto;

import jakarta.validation.constraints.NotNull;
import vn.io.naherb.common.enums.OrderStatus;

public record UpdateOrderStatusRequest(@NotNull OrderStatus orderStatus, String note) {}
