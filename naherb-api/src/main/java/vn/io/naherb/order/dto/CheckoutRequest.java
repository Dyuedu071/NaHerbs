package vn.io.naherb.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import vn.io.naherb.account.dto.UpsertAddressRequest;
import vn.io.naherb.common.enums.PaymentMethod;

import java.util.List;

public record CheckoutRequest(
        List<UUID> cartItemIds,
        UUID shippingAddressId,
        @Valid UpsertAddressRequest shippingAddress,
        Boolean saveAddress,
        String note,
        @NotNull PaymentMethod paymentMethod) {}
