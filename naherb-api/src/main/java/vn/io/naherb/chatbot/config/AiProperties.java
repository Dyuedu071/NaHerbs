package vn.io.naherb.chatbot.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.ai")
@Getter
@Setter
public class AiProperties {

    private String provider = "openai";
    private String apiKey = "";
    private String model = "gpt-4o-mini";
    private String embeddingModel = "text-embedding-3-small";
    private String baseUrl = "https://api.openai.com/v1";
}
