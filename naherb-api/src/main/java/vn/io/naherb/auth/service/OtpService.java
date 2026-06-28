package vn.io.naherb.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final StringRedisTemplate redisTemplate;
    private static final String OTP_PREFIX = "otp:register:";
    private static final String DATA_PREFIX = "otp:data:";
    private static final SecureRandom secureRandom = new SecureRandom();

    public String generateAndStoreOtp(String email, String payloadJson) {
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        redisTemplate.opsForValue().set(OTP_PREFIX + email, otp, Duration.ofMinutes(5));
        redisTemplate.opsForValue().set(DATA_PREFIX + email, payloadJson, Duration.ofMinutes(5));
        log.info("Generated OTP for {}", email);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = redisTemplate.opsForValue().get(OTP_PREFIX + email);
        return storedOtp != null && storedOtp.equals(otp);
    }
    
    public String getStoredPayload(String email) {
        return redisTemplate.opsForValue().get(DATA_PREFIX + email);
    }
    
    public void clearOtp(String email) {
        redisTemplate.delete(OTP_PREFIX + email);
        redisTemplate.delete(DATA_PREFIX + email);
    }
}
