package vn.io.naherb.account.dto;

import java.time.Instant;
import java.util.UUID;

public record AccountProfileResponse(
        UUID accountId,
        String fullName,
        String phone,
        String contactEmail,
        String avatarUrl,
        Instant createdAt,
        Instant updatedAt) {}
