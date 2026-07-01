package vn.io.naherb.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import vn.io.naherb.account.dto.UpsertAddressRequest;
import vn.io.naherb.common.enums.PaymentMethod;

public record CheckoutRequest(
        UUID shippingAddressId,
        @Valid UpsertAddressRequest shippingAddress,
        Boolean saveAddress,
        String note,
        @NotNull PaymentMethod paymentMethod) {}
