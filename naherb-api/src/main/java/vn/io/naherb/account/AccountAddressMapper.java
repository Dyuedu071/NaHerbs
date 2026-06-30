package vn.io.naherb.account;

import vn.io.naherb.account.dto.AccountAddressResponse;

public final class AccountAddressMapper {

    private AccountAddressMapper() {}

    public static AccountAddressResponse toResponse(AccountAddress address) {
        return new AccountAddressResponse(
                address.getId(),
                address.getAccount().getId(),
                address.getReceiverName(),
                address.getReceiverPhone(),
                address.getReceiverEmail(),
                address.getProvinceName(),
                address.getWardName(),
                address.getAddressLine(),
                address.getNote(),
                address.isDefault(),
                address.getCreatedAt(),
                address.getUpdatedAt());
    }
}
