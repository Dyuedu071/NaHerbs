package vn.io.naherb.security.token;

import java.time.Duration;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccessTokenRevocationService {

    private final TokenStore tokenStore;

    public void revoke(Jwt jwt) {
        if (jwt == null || jwt.getId() == null || jwt.getExpiresAt() == null) {
            return;
        }

        Duration remainingTtl = Duration.between(Instant.now(), jwt.getExpiresAt());
        if (!remainingTtl.isNegative() && !remainingTtl.isZero()) {
            tokenStore.revokeAccessToken(jwt.getId(), remainingTtl);
        }
    }
}
