package vn.io.naherb.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;

public class LenientCookieBearerTokenResolver implements BearerTokenResolver {

    private final BearerTokenResolver delegate;
    private final JwtDecoder jwtDecoder;

    public LenientCookieBearerTokenResolver(BearerTokenResolver delegate, JwtDecoder jwtDecoder) {
        this.delegate = delegate;
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public String resolve(HttpServletRequest request) {
        String token = delegate.resolve(request);
        if (token == null || token.isBlank()) {
            return null;
        }
        try {
            jwtDecoder.decode(token);
            return token;
        } catch (JwtException exception) {
            return null;
        }
    }
}
