package vn.io.naherb.auth.dto;

import java.util.UUID;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.Role;

public record UserResponse(UUID id, String email, String name, Role role) {

    public static UserResponse from(Account account) {
        return new UserResponse(
                account.getId(),
                account.getEmail(),
                account.getName(),
                account.getRole());
    }
}
