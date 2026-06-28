package vn.io.naherb.auth.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class RateLimitFilter extends OncePerRequestFilter {

    @Value("${app.security.ratelimit.otp.capacity:1}")
    private long otpCapacity;

    @Value("${app.security.ratelimit.otp.refill-tokens:1}")
    private long otpTokens;

    @Value("${app.security.ratelimit.otp.refill-duration:PT1M}")
    private Duration otpDuration;

    @Value("${app.security.ratelimit.login.capacity:3}")
    private long loginCapacity;

    @Value("${app.security.ratelimit.login.refill-tokens:3}")
    private long loginTokens;

    @Value("${app.security.ratelimit.login.refill-duration:PT1M}")
    private Duration loginDuration;

    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> otpBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String ip = getClientIP(request);

        if (path.equals("/api/auth/login") && request.getMethod().equalsIgnoreCase("POST")) {
            Bucket bucket = loginBuckets.computeIfAbsent(ip, this::createNewLoginBucket);
            if (!bucket.tryConsume(1)) {
                response.setStatus(429);
                response.getWriter().write("Too many login attempts. Please try again later.");
                return;
            }
        }

        if (path.equals("/api/auth/register-otp") && request.getMethod().equalsIgnoreCase("POST")) {
            Bucket bucket = otpBuckets.computeIfAbsent(ip, this::createNewOtpBucket);
            if (!bucket.tryConsume(1)) {
                response.setStatus(429);
                response.getWriter().write("Too many OTP requests. Please wait a minute before requesting another one.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Bucket createNewLoginBucket(String key) {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(loginCapacity, Refill.greedy(loginTokens, loginDuration)))
                .build();
    }

    private Bucket createNewOtpBucket(String key) {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(otpCapacity, Refill.greedy(otpTokens, otpDuration)))
                .build();
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
