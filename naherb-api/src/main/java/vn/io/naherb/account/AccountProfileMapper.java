package vn.io.naherb.account;

import vn.io.naherb.account.dto.AccountProfileResponse;

public final class AccountProfileMapper {

    private AccountProfileMapper() {}

    public static AccountProfileResponse toResponse(AccountProfile profile) {
        return new AccountProfileResponse(
                profile.getAccount().getId(),
                profile.getFullName(),
                profile.getPhone(),
                profile.getContactEmail(),
                profile.getAvatarUrl(),
                profile.getCreatedAt(),
                profile.getUpdatedAt());
    }
}
