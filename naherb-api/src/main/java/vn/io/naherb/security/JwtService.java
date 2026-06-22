package vn.io.naherb.security;

import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;
import vn.io.naherb.account.Account;
import vn.io.naherb.config.SecurityProperties;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final SecurityProperties properties;

    public String createToken(Account account) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(properties.getJwt().getIssuer())
                .issuedAt(now)
                .expiresAt(now.plus(properties.getJwt().getExpiration()))
                .subject(account.getEmail())
                .id(UUID.randomUUID().toString())
                .claim("name", account.getName())
                .claim("role", account.getRole().name())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
