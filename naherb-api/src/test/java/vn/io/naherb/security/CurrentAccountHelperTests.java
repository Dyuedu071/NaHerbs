package vn.io.naherb.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountRepository;

class CurrentAccountHelperTests {

    private static final UUID TEST_ACCOUNT_ID = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
    private static final String TEST_EMAIL = "user@naherb.vn";

    @Test
    void requireAccountEmailReturnsJwtSubject() {
        JwtAuthenticationToken authentication = authenticationWithSubject(TEST_EMAIL);

        assertEquals(TEST_EMAIL, CurrentAccountHelper.requireAccountEmail(authentication));
    }

    @Test
    void requireAccountIdResolvesAccountFromEmailSubject() {
        AccountRepository accountRepository = mock(AccountRepository.class);
        Account account = mock(Account.class);
        when(account.getId()).thenReturn(TEST_ACCOUNT_ID);
        when(accountRepository.findByEmailIgnoreCase(TEST_EMAIL)).thenReturn(Optional.of(account));

        JwtAuthenticationToken authentication = authenticationWithSubject(TEST_EMAIL);

        assertEquals(TEST_ACCOUNT_ID, CurrentAccountHelper.requireAccountId(authentication, accountRepository));
    }

    private static JwtAuthenticationToken authenticationWithSubject(String subject) {
        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(subject);

        JwtAuthenticationToken authentication = mock(JwtAuthenticationToken.class);
        when(authentication.getToken()).thenReturn(jwt);
        return authentication;
    }
}
