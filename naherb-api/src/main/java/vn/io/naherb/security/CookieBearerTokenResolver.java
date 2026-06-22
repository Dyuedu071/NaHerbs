package vn.io.naherb.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Set;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;

public class CookieBearerTokenResolver implements BearerTokenResolver {

    private final String cookieName;
    private final Set<String> ignoredPaths;

    public CookieBearerTokenResolver(String cookieName, Set<String> ignoredPaths) {
        this.cookieName = cookieName;
        this.ignoredPaths = Set.copyOf(ignoredPaths);
    }

    @Override
    public String resolve(HttpServletRequest request) {
        if (ignoredPaths.contains(request.getRequestURI()) || request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
