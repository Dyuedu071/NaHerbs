package vn.io.naherb;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import vn.io.naherb.security.token.TokenStore;

@TestConfiguration
class InMemoryTokenStoreTestConfig {

    @Bean
    @Primary
    TokenStore inMemoryTokenStore() {
        return new InMemoryTokenStore();
    }

    private static class InMemoryTokenStore implements TokenStore {

        private final Map<String, String> refreshTokens = new ConcurrentHashMap<>();
        private final Set<String> revokedAccessTokens = ConcurrentHashMap.newKeySet();

        @Override
        public void saveRefreshToken(String tokenHash, String subject, Duration ttl) {
            refreshTokens.put(tokenHash, subject);
        }

        @Override
        public Optional<String> consumeRefreshToken(String tokenHash) {
            return Optional.ofNullable(refreshTokens.remove(tokenHash));
        }

        @Override
        public void deleteRefreshToken(String tokenHash) {
            refreshTokens.remove(tokenHash);
        }

        @Override
        public void revokeAccessToken(String jwtId, Duration ttl) {
            revokedAccessTokens.add(jwtId);
        }

        @Override
        public boolean isAccessTokenRevoked(String jwtId) {
            return revokedAccessTokens.contains(jwtId);
        }
    }
}
