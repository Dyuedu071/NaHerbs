package vn.io.naherb.auth.dto;

import vn.io.naherb.account.Account;
import vn.io.naherb.account.Role;

public record UserResponse(Long id, String email, String name, Role role) {

    public static UserResponse from(Account account) {
        return new UserResponse(
                account.getId(),
                account.getEmail(),
                account.getName(),
                account.getRole());
    }
}
