package vn.io.naherb.account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank @Size(max = 100) String fullName,
        @Size(max = 20) String phone,
        @Email @Size(max = 254) String contactEmail,
        String avatarUrl) {}
