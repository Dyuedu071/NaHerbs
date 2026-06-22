package vn.io.naherb.auth;

import java.util.Locale;
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
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AccessTokenRevocationService accessTokenRevocationService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (accountRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email đã được sử dụng");
        }

        Account account = new Account(
                email,
                passwordEncoder.encode(request.password()),
                request.name().trim());
        return UserResponse.from(accountRepository.save(account));
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
