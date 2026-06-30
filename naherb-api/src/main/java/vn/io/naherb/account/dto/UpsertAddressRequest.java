package vn.io.naherb.account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertAddressRequest(
        @NotBlank @Size(max = 100) String receiverName,
        @NotBlank @Size(max = 20) String receiverPhone,
        @Email @Size(max = 254) String email,
        @NotBlank @Size(max = 100) String provinceCity,
        @NotBlank @Size(max = 100) String wardCommune,
        @NotBlank @Size(max = 255) String addressDetail,
        String note,
        Boolean isDefault) {}
