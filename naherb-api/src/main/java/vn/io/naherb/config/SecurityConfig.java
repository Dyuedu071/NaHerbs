package vn.io.naherb.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.proc.SecurityContext;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import vn.io.naherb.security.AccountUserDetailsService;
import vn.io.naherb.security.CookieBearerTokenResolver;
import vn.io.naherb.security.LenientCookieBearerTokenResolver;
import vn.io.naherb.security.token.RevokedAccessTokenValidator;
import vn.io.naherb.security.token.TokenStore;

@Configuration
@EnableMethodSecurity
@EnableConfigurationProperties(SecurityProperties.class)
@RequiredArgsConstructor
public class SecurityConfig {

    private final SecurityProperties properties;

    @Bean
    @Order(1)
    SecurityFilterChain chatbotSecurityFilterChain(HttpSecurity http, JwtDecoder jwtDecoder) throws Exception {
        JwtAuthenticationProvider jwtProvider = new JwtAuthenticationProvider(jwtDecoder);
        jwtProvider.setJwtAuthenticationConverter(jwtAuthenticationConverter());
        BearerTokenAuthenticationFilter jwtFilter =
                new BearerTokenAuthenticationFilter(new ProviderManager(jwtProvider));
        jwtFilter.setBearerTokenResolver(new LenientCookieBearerTokenResolver(
                new CookieBearerTokenResolver(
                        properties.getCookie().getAccessName(),
                        Set.of(),
                        Set.of()),
                jwtDecoder));

        http.securityMatcher("/api/chatbot/**")
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        return http.build();
    }

    @Bean
    @Order(2)
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtDecoder jwtDecoder) throws Exception {
        CookieCsrfTokenRepository csrfRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        csrfRepository.setCookiePath("/");
        csrfRepository.setCookieCustomizer(cookie -> cookie
                .secure(properties.getCookie().isSecure())
                .sameSite(properties.getCookie().getSameSite()));

        CsrfTokenRequestAttributeHandler csrfHandler = new CsrfTokenRequestAttributeHandler();
        csrfHandler.setCsrfRequestAttributeName("_csrf");

        JwtAuthenticationProvider jwtProvider = new JwtAuthenticationProvider(jwtDecoder);
        jwtProvider.setJwtAuthenticationConverter(jwtAuthenticationConverter());
        BearerTokenAuthenticationFilter jwtFilter =
                new BearerTokenAuthenticationFilter(new ProviderManager(jwtProvider));
        jwtFilter.setBearerTokenResolver(new CookieBearerTokenResolver(
                properties.getCookie().getAccessName(),
                Set.of(
                        "/api/auth/csrf",
                        "/api/auth/login",
                        "/api/auth/register",
                        "/api/auth/register-otp",
                        "/api/auth/google",
                        "/api/auth/refresh"),
                Set.of()));
        jwtFilter.setAuthenticationEntryPoint((request, response, exception) ->
                writeError(response, 401, "Unauthorized"));

        http.securityMatcher("/**")
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfRepository)
                        .csrfTokenRequestHandler(csrfHandler)
                        .ignoringRequestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/register-otp",
                                "/api/auth/google",
                                "/api/auth/refresh",
                                "/api/admin/**",
                                "/api/account/**",
                                "/api/v1/admin/media/**"))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .requestCache(cache -> cache.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .logout(logout -> logout.disable())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) ->
                                writeError(response, 401, "Unauthorized"))
                        .accessDeniedHandler((request, response, exception) ->
                                writeError(response, 403, "Forbidden")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/api/auth/csrf",
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/register-otp",
                                "/api/auth/google",
                                "/api/auth/refresh",
                                "/api/health",
                                "/api/v1/health",
                                "/api/products/**",
                                "/api/product-categories/**",
                                "/api/blogs/**",
                                "/api/blog-posts/**",
                                "/api/v1/products/**",
                                "/api/v1/product-categories/**",
                                "/api/v1/blogs/**",
                                "/api/v1/blog-posts/**",
                                "/api/media/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html")
                        .permitAll()
                        .requestMatchers("/api/admin/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private static void writeError(jakarta.servlet.http.HttpServletResponse response, int status, String message)
            throws java.io.IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }

    @Bean
    AuthenticationManager authenticationManager(
            AccountUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(provider);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    JwtEncoder jwtEncoder(SecretKey jwtSecretKey) {
        return new NimbusJwtEncoder(new ImmutableSecret<SecurityContext>(jwtSecretKey));
    }

    @Bean
    JwtDecoder jwtDecoder(SecretKey jwtSecretKey, TokenStore tokenStore) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(jwtSecretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(properties.getJwt().getIssuer()),
                new RevokedAccessTokenValidator(tokenStore)));
        return decoder;
    }

    @Bean
    SecretKey jwtSecretKey() {
        byte[] key = properties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
        if (key.length < 32) {
            throw new IllegalStateException("JWT_SECRET must be at least 32 bytes");
        }
        return new SecretKeySpec(key, "HmacSHA256");
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("role");
        authorities.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(properties.getCors().getAllowedOrigins());
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("Content-Type", "Accept", "X-XSRF-TOKEN", "Authorization", "Origin"));
        cors.setAllowCredentials(true);
        cors.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }
}
