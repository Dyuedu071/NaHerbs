package vn.io.naherb.auth.dto;

import java.util.UUID;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.Role;

public record UserResponse(UUID id, String email, String name, Role role, String avatarUrl) {

    public static UserResponse from(Account account, String avatarUrl) {
        return new UserResponse(
                account.getId(),
                account.getEmail(),
                account.getName(),
                account.getRole(),
                avatarUrl);
    }

    public static UserResponse from(Account account) {
        return from(account, null);
    }
}
