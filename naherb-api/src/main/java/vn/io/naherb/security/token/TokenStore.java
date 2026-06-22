package vn.io.naherb.security.token;

import java.time.Duration;
import java.util.Optional;

public interface TokenStore {

    void saveRefreshToken(String tokenHash, String subject, Duration ttl);

    Optional<String> consumeRefreshToken(String tokenHash);

    void deleteRefreshToken(String tokenHash);

    void revokeAccessToken(String jwtId, Duration ttl);

    boolean isAccessTokenRevoked(String jwtId);
}
