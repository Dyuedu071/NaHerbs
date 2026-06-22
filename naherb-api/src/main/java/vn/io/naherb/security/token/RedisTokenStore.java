package vn.io.naherb.security.token;

import java.time.Duration;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RedisTokenStore implements TokenStore {

    private static final String REFRESH_PREFIX = "naherb:auth:refresh:";
    private static final String REVOKED_PREFIX = "naherb:auth:revoked:";

    private final StringRedisTemplate redisTemplate;

    @Override
    public void saveRefreshToken(String tokenHash, String subject, Duration ttl) {
        redisTemplate.opsForValue().set(REFRESH_PREFIX + tokenHash, subject, ttl);
    }

    @Override
    public Optional<String> consumeRefreshToken(String tokenHash) {
        return Optional.ofNullable(redisTemplate.opsForValue().getAndDelete(REFRESH_PREFIX + tokenHash));
    }

    @Override
    public void deleteRefreshToken(String tokenHash) {
        redisTemplate.delete(REFRESH_PREFIX + tokenHash);
    }

    @Override
    public void revokeAccessToken(String jwtId, Duration ttl) {
        redisTemplate.opsForValue().set(REVOKED_PREFIX + jwtId, "1", ttl);
    }

    @Override
    public boolean isAccessTokenRevoked(String jwtId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(REVOKED_PREFIX + jwtId));
    }
}
