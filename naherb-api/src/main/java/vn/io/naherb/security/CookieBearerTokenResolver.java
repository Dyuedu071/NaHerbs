package vn.io.naherb.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Set;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;

public class CookieBearerTokenResolver implements BearerTokenResolver {

    private final String cookieName;
    private final Set<String> ignoredExactPaths;
    private final Set<String> ignoredPathPrefixes;

    public CookieBearerTokenResolver(
            String cookieName, Set<String> ignoredExactPaths, Set<String> ignoredPathPrefixes) {
        this.cookieName = cookieName;
        this.ignoredExactPaths = Set.copyOf(ignoredExactPaths);
        this.ignoredPathPrefixes = Set.copyOf(ignoredPathPrefixes);
    }

    @Override
    public String resolve(HttpServletRequest request) {
        if (isIgnored(request.getRequestURI()) || request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private boolean isIgnored(String requestUri) {
        if (ignoredExactPaths.contains(requestUri)) {
            return true;
        }
        for (String prefix : ignoredPathPrefixes) {
            if (requestUri.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }
}
