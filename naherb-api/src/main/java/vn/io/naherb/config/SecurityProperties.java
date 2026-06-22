package vn.io.naherb.config;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    private final Jwt jwt = new Jwt();
    private final Refresh refresh = new Refresh();
    private final Cookie cookie = new Cookie();
    private final Cors cors = new Cors();

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private String issuer;
        private Duration expiration;
    }

    @Getter
    @Setter
    public static class Refresh {
        private Duration expiration;
    }

    @Getter
    @Setter
    public static class Cookie {
        private String accessName;
        private String refreshName;
        private boolean secure;
        private String sameSite;
    }

    @Getter
    @Setter
    public static class Cors {
        private List<String> allowedOrigins = new ArrayList<>();
    }
}
