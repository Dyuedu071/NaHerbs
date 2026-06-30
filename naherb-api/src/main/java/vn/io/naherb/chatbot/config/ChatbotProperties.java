package vn.io.naherb.chatbot.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.chatbot")
@Getter
@Setter
public class ChatbotProperties {

    private String knowledgePath = "../content/chatbot-knowledge";
    private boolean ingestOnStartup = true;
    private int ragTopK = 14;
    private int ragPerDocumentTopK = 6;
    private int chunkSize = 800;
    private int chunkOverlap = 120;
    private long knowledgeMaxUploadBytes = 15L * 1024 * 1024;
}
