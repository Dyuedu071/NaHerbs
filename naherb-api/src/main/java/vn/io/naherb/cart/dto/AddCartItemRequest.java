package vn.io.naherb.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AddCartItemRequest(
        @NotNull UUID skuId,
        @NotNull @Min(1) Integer quantity) {}
