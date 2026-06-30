package vn.io.naherb.security;

import java.util.UUID;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.exception.NotFoundException;

public final class CurrentAccountHelper {

    private CurrentAccountHelper() {}

    public static String requireAccountEmail(JwtAuthenticationToken authentication) {
        return authentication.getToken().getSubject();
    }

    public static UUID requireAccountId(
            JwtAuthenticationToken authentication, AccountRepository accountRepository) {
        return accountRepository
                .findByEmailIgnoreCase(requireAccountEmail(authentication))
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản"))
                .getId();
    }
}
