package vn.io.naherb.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.upload")
@Getter
@Setter
public class UploadProperties {

    private String basePath = "uploads";
    private String publicBaseUrl = "http://localhost:8080/api";
    private long maxAvatarBytes = 2L * 1024 * 1024;
}
