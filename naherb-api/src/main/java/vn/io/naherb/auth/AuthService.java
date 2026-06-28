package vn.io.naherb.auth;

import java.util.Locale;

import java.util.Collections;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import vn.io.naherb.auth.service.OtpService;
import vn.io.naherb.auth.service.EmailService;
import vn.io.naherb.exception.BadRequestException;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.account.AccountProfile;
import vn.io.naherb.account.AccountProfileRepository;
import vn.io.naherb.cart.Cart;
import vn.io.naherb.cart.CartRepository;
import vn.io.naherb.auth.dto.LoginRequest;
import vn.io.naherb.auth.dto.RegisterRequest;
import vn.io.naherb.auth.dto.UserResponse;
import vn.io.naherb.exception.ConflictException;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.security.JwtService;
import vn.io.naherb.security.token.AccessTokenRevocationService;
import vn.io.naherb.security.token.RefreshTokenService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository accountRepository;
    private final AccountProfileRepository accountProfileRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AccessTokenRevocationService accessTokenRevocationService;
    private final OtpService otpService;
    private final EmailService emailService;
    
    @Value("${app.security.google.client-id}")
    private String googleClientId;


    public void sendRegisterOtp(String email) {
        String normalizedEmail = normalizeEmail(email);
        if (accountRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ConflictException("Email đã được sử dụng");
        }
        String otp = otpService.generateAndStoreOtp(normalizedEmail, "{}");
        emailService.sendOtpEmail(normalizedEmail, otp);
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (!otpService.verifyOtp(email, request.otp())) {
            throw new BadRequestException("Mã OTP không hợp lệ hoặc đã hết hạn");
        }
        
        if (accountRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email đã được sử dụng");
        }

        if (request.phone() != null && !request.phone().isBlank()) {
            String cleanPhone = request.phone().trim();
            if (accountProfileRepository.existsByPhone(cleanPhone)) {
                throw new ConflictException("Số điện thoại đã được sử dụng");
            }
        }

        Account account = new Account(
                email,
                passwordEncoder.encode(request.password()),
                request.name().trim());
        account = accountRepository.save(account);

        AccountProfile profile = new AccountProfile(
                account,
                account.getName(),
                request.phone() != null ? request.phone().trim() : null,
                account.getEmail(),
                null);
        accountProfileRepository.save(profile);

        Cart cart = new Cart(account);
        cartRepository.save(cart);

        otpService.clearOtp(email);
        return UserResponse.from(account);
    }
    
    @Transactional
    public SessionResult loginWithGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
                
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new BadRequestException("Invalid Google ID Token");
            }
            
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = normalizeEmail(payload.getEmail());
            String name = (String) payload.get("name");
            String avatarUrl = (String) payload.get("picture");
            
            Account account = accountRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
                Account newAccount = new Account(email, passwordEncoder.encode(java.util.UUID.randomUUID().toString()), name);
                newAccount = accountRepository.save(newAccount);
                
                AccountProfile profile = new AccountProfile(
                        newAccount,
                        newAccount.getName(),
                        null,
                        newAccount.getEmail(),
                        avatarUrl);
                accountProfileRepository.save(profile);
                
                Cart cart = new Cart(newAccount);
                cartRepository.save(cart);
                
                return newAccount;
            });
            
            return createSession(account, refreshTokenService.issue(account.getEmail()));
        } catch (Exception e) {
            throw new BadRequestException("Failed to verify Google ID Token: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public SessionResult login(LoginRequest request, String existingRefreshToken) {
        String email = normalizeEmail(request.email());
        authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(email, request.password()));

        Account account = findByEmail(email);
        refreshTokenService.revoke(existingRefreshToken);
        return createSession(account, refreshTokenService.issue(account.getEmail()));
    }

    @Transactional(readOnly = true)
    public SessionResult refresh(String rawRefreshToken) {
        RefreshTokenService.IssuedRefreshToken refreshToken = refreshTokenService.rotate(rawRefreshToken);
        Account account = findByEmail(refreshToken.subject());
        if (!account.isEnabled()) {
            refreshTokenService.revoke(refreshToken.token());
            throw new DisabledException("Tài khoản đã bị vô hiệu hóa");
        }
        return createSession(account, refreshToken);
    }

    public void logout(Jwt accessToken, String rawRefreshToken) {
        accessTokenRevocationService.revoke(accessToken);
        refreshTokenService.revoke(rawRefreshToken);
    }

    @Transactional(readOnly = true)
    public UserResponse currentUser(String email) {
        return UserResponse.from(findByEmail(email));
    }

    private Account findByEmail(String email) {
        return accountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản"));
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private SessionResult createSession(
            Account account,
            RefreshTokenService.IssuedRefreshToken refreshToken) {
        return new SessionResult(
                UserResponse.from(account),
                jwtService.createToken(account),
                refreshToken.token());
    }

    public record SessionResult(UserResponse user, String accessToken, String refreshToken) {
    }
}
