package vn.io.naherb.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.auth.dto.LoginRequest;
import vn.io.naherb.auth.dto.RegisterRequest;
import vn.io.naherb.auth.dto.UserResponse;
import vn.io.naherb.security.AuthCookieService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieService authCookieService;

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken csrfToken) {
        return Map.of(
                "headerName", csrfToken.getHeaderName(),
                "parameterName", csrfToken.getParameterName(),
                "token", csrfToken.getToken());
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/register-otp")
    public ResponseEntity<Map<String, String>> sendRegisterOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        authService.sendRegisterOtp(email);
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/google")
    public ResponseEntity<UserResponse> loginWithGoogle(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return sessionResponse(authService.loginWithGoogle(idToken));
    }


    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {
        String existingRefreshToken = authCookieService.findRefreshToken(request).orElse(null);
        return sessionResponse(authService.login(loginRequest, existingRefreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserResponse> refresh(HttpServletRequest request) {
        String refreshToken = authCookieService.findRefreshToken(request).orElse(null);
        return sessionResponse(authService.refresh(refreshToken));
    }

    @GetMapping("/me")
    public UserResponse me(JwtAuthenticationToken authentication) {
        return authService.currentUser(authentication.getToken().getSubject());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            JwtAuthenticationToken authentication,
            HttpServletRequest request) {
        authService.logout(
                authentication.getToken(),
                authCookieService.findRefreshToken(request).orElse(null));
        return ResponseEntity.noContent()
                .header(
                        HttpHeaders.SET_COOKIE,
                        authCookieService.deleteAccess(),
                        authCookieService.deleteRefresh())
                .build();
    }

    private ResponseEntity<UserResponse> sessionResponse(AuthService.SessionResult result) {
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        authCookieService.createAccess(result.accessToken()),
                        authCookieService.createRefresh(result.refreshToken()))
                .body(result.user());
    }
}
