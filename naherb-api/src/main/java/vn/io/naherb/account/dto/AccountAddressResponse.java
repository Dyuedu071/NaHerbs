package vn.io.naherb.account.dto;

import java.time.Instant;
import java.util.UUID;

public record AccountAddressResponse(
        UUID id,
        UUID accountId,
        String receiverName,
        String receiverPhone,
        String email,
        String provinceCity,
        String wardCommune,
        String addressDetail,
        String note,
        boolean isDefault,
        Instant createdAt,
        Instant updatedAt) {}
