package vn.io.naherb.security.token;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

@RequiredArgsConstructor
public class RevokedAccessTokenValidator implements OAuth2TokenValidator<Jwt> {

    private static final OAuth2Error REVOKED = new OAuth2Error(
            "invalid_token",
            "Access token đã bị thu hồi",
            null);

    private final TokenStore tokenStore;

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        String jwtId = jwt.getId();
        if (jwtId == null || jwtId.isBlank() || tokenStore.isAccessTokenRevoked(jwtId)) {
            return OAuth2TokenValidatorResult.failure(REVOKED);
        }
        return OAuth2TokenValidatorResult.success();
    }
}
