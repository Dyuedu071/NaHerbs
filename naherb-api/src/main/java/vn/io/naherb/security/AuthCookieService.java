package vn.io.naherb.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import vn.io.naherb.config.SecurityProperties;

@Service
@RequiredArgsConstructor
public class AuthCookieService {

    private static final String ACCESS_PATH = "/";
    private static final String REFRESH_PATH = "/api/auth";

    private final SecurityProperties properties;

    public String createAccess(String token) {
        return baseCookie(properties.getCookie().getAccessName(), token, ACCESS_PATH)
                .maxAge(properties.getJwt().getExpiration())
                .build()
                .toString();
    }

    public String createRefresh(String token) {
        return baseCookie(properties.getCookie().getRefreshName(), token, REFRESH_PATH)
                .maxAge(properties.getRefresh().getExpiration())
                .build()
                .toString();
    }

    public String deleteAccess() {
        return baseCookie(properties.getCookie().getAccessName(), "", ACCESS_PATH)
                .maxAge(Duration.ZERO)
                .build()
                .toString();
    }

    public String deleteRefresh() {
        return baseCookie(properties.getCookie().getRefreshName(), "", REFRESH_PATH)
                .maxAge(Duration.ZERO)
                .build()
                .toString();
    }

    public Optional<String> findRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> properties.getCookie().getRefreshName().equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }

    private ResponseCookie.ResponseCookieBuilder baseCookie(String name, String value, String path) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(properties.getCookie().isSecure())
                .sameSite(properties.getCookie().getSameSite())
                .path(path);
    }
}
