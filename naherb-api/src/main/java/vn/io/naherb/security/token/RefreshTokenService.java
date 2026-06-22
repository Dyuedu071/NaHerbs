package vn.io.naherb.security.token;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.io.naherb.config.SecurityProperties;
import vn.io.naherb.exception.InvalidRefreshTokenException;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 32;

    private final SecureRandom secureRandom = new SecureRandom();
    private final TokenStore tokenStore;
    private final SecurityProperties properties;

    public IssuedRefreshToken issue(String subject) {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        tokenStore.saveRefreshToken(
                hash(rawToken),
                subject,
                properties.getRefresh().getExpiration());
        return new IssuedRefreshToken(subject, rawToken);
    }

    public IssuedRefreshToken rotate(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw invalidRefreshToken();
        }

        String subject = tokenStore.consumeRefreshToken(hash(rawToken))
                .orElseThrow(RefreshTokenService::invalidRefreshToken);
        return issue(subject);
    }

    public void revoke(String rawToken) {
        if (rawToken != null && !rawToken.isBlank()) {
            tokenStore.deleteRefreshToken(hash(rawToken));
        }
    }

    private static String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 không khả dụng", exception);
        }
    }

    private static InvalidRefreshTokenException invalidRefreshToken() {
        return new InvalidRefreshTokenException();
    }

    public record IssuedRefreshToken(String subject, String token) {
    }
}
