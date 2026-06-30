package vn.io.naherb;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import vn.io.naherb.security.token.TokenStore;

@TestConfiguration
public class InMemoryTokenStoreTestConfig {

    @Bean
    @Primary
    TokenStore inMemoryTokenStore() {
        return new InMemoryTokenStore();
    }

    @Bean
    @Primary
    StringRedisTemplate stringRedisTemplate() {
        Map<String, String> store = new ConcurrentHashMap<>();
        StringRedisTemplate template = mock(StringRedisTemplate.class);
        @SuppressWarnings("unchecked")
        ValueOperations<String, String> valueOperations = mock(ValueOperations.class);
        when(template.opsForValue()).thenReturn(valueOperations);

        doAnswer(invocation -> {
                    store.put(invocation.getArgument(0), invocation.getArgument(1));
                    return null;
                })
                .when(valueOperations)
                .set(anyString(), anyString(), any(Duration.class));
        when(valueOperations.get(any())).thenAnswer(invocation -> store.get(invocation.getArgument(0)));
        when(valueOperations.getAndDelete(anyString()))
                .thenAnswer(invocation -> store.remove(invocation.getArgument(0)));
        when(template.delete(anyString()))
                .thenAnswer(invocation -> store.remove(invocation.getArgument(0)) != null);

        return template;
    }

    @Bean
    @Primary
    JavaMailSender javaMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost("localhost");
        sender.setPort(1025);
        return sender;
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
