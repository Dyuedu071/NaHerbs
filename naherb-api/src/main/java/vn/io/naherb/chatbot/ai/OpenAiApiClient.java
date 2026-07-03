package vn.io.naherb.chatbot.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import vn.io.naherb.chatbot.config.AiProperties;
import vn.io.naherb.exception.AiUnavailableException;

@Component
@Slf4j
public class OpenAiApiClient implements OpenAiClient {

    private final AiProperties aiProperties;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public OpenAiApiClient(AiProperties aiProperties, ObjectMapper objectMapper) {
        this.aiProperties = aiProperties;
        this.objectMapper = objectMapper;
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(15));
        requestFactory.setReadTimeout(Duration.ofSeconds(90));
        this.restClient = RestClient.builder().requestFactory(requestFactory).build();
    }

    @Override
    public float[] embed(String text) {
        ensureConfigured();
        try {
            Map<String, Object> body = Map.of(
                    "model", aiProperties.getEmbeddingModel(),
                    "input", text);

            String response = restClient
                    .post()
                    .uri(aiProperties.getBaseUrl() + "/embeddings")
                    .header("Authorization", "Bearer " + aiProperties.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), this::toAiError)
                    .body(String.class);

            JsonNode embeddingNode = objectMapper
                    .readTree(response)
                    .path("data")
                    .path(0)
                    .path("embedding");
            if (!embeddingNode.isArray()) {
                throw new AiUnavailableException("Phản hồi embedding không hợp lệ từ OpenAI");
            }
            float[] vector = new float[embeddingNode.size()];
            for (int i = 0; i < embeddingNode.size(); i++) {
                vector[i] = (float) embeddingNode.get(i).asDouble();
            }
            return vector;
        } catch (AiUnavailableException exception) {
            throw exception;
        } catch (RestClientException | java.io.IOException exception) {
            log.warn("Không thể gọi OpenAI embeddings: {}", exception.getMessage());
            throw new AiUnavailableException("Không thể gọi OpenAI embeddings: " + exception.getMessage(), exception);
        }
    }

    @Override
    public String chat(List<ChatMessage> messages) {
        ensureConfigured();
        try {
            List<Map<String, String>> payloadMessages = new ArrayList<>();
            for (ChatMessage message : messages) {
                payloadMessages.add(Map.of("role", message.role(), "content", message.content()));
            }

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", aiProperties.getModel());
            body.put("messages", payloadMessages);
            body.put("temperature", 0.3);

            String response = restClient
                    .post()
                    .uri(aiProperties.getBaseUrl() + "/chat/completions")
                    .header("Authorization", "Bearer " + aiProperties.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), this::toAiError)
                    .body(String.class);

            JsonNode content = objectMapper
                    .readTree(response)
                    .path("choices")
                    .path(0)
                    .path("message")
                    .path("content");
            if (!content.isTextual() || content.asText().isBlank()) {
                throw new AiUnavailableException("Phản hồi chat không hợp lệ từ OpenAI");
            }
            return content.asText().trim();
        } catch (AiUnavailableException exception) {
            throw exception;
        } catch (RestClientException | java.io.IOException exception) {
            log.warn("Không thể gọi OpenAI chat completions: {}", exception.getMessage());
            throw new AiUnavailableException(
                    "Không thể gọi OpenAI chat completions: " + exception.getMessage(), exception);
        }
    }

    @Override
    public void chatStream(List<ChatMessage> messages, Consumer<String> onToken) {
        ensureConfigured();
        HttpURLConnection connection = null;
        try {
            List<Map<String, String>> payloadMessages = new ArrayList<>();
            for (ChatMessage message : messages) {
                payloadMessages.add(Map.of("role", message.role(), "content", message.content()));
            }

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", aiProperties.getModel());
            body.put("messages", payloadMessages);
            body.put("temperature", 0.3);
            body.put("stream", true);

            connection = (HttpURLConnection)
                    URI.create(aiProperties.getBaseUrl() + "/chat/completions").toURL().openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setConnectTimeout(15_000);
            connection.setReadTimeout(90_000);
            connection.setRequestProperty("Authorization", "Bearer " + aiProperties.getApiKey());
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "text/event-stream");

            byte[] payload = objectMapper.writeValueAsBytes(body);
            connection.getOutputStream().write(payload);

            int status = connection.getResponseCode();
            if (status >= 400) {
                String errorBody = StreamUtils.copyToString(connection.getErrorStream(), StandardCharsets.UTF_8);
                throw new AiUnavailableException(summarizeOpenAiError(status, errorBody));
            }

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (!line.startsWith("data:")) {
                        continue;
                    }
                    String data = line.substring(5).trim();
                    if ("[DONE]".equals(data)) {
                        break;
                    }
                    JsonNode content = objectMapper
                            .readTree(data)
                            .path("choices")
                            .path(0)
                            .path("delta")
                            .path("content");
                    if (content.isTextual()) {
                        onToken.accept(content.asText());
                    }
                }
            }
        } catch (AiUnavailableException exception) {
            throw exception;
        } catch (Exception exception) {
            log.warn("Không thể stream OpenAI chat completions: {}", exception.getMessage());
            throw new AiUnavailableException(
                    "Không thể stream OpenAI chat completions: " + exception.getMessage(), exception);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private void ensureConfigured() {
        if (!StringUtils.hasText(aiProperties.getApiKey())) {
            throw new AiUnavailableException("AI_API_KEY chưa được cấu hình trong .env.backend");
        }
    }

    private void toAiError(org.springframework.http.HttpRequest request, org.springframework.http.client.ClientHttpResponse response) {
        try {
            int status = response.getStatusCode().value();
            String body = StreamUtils.copyToString(response.getBody(), StandardCharsets.UTF_8);
            String message = summarizeOpenAiError(status, body);
            log.warn("OpenAI HTTP {}: {}", status, message);
            throw new AiUnavailableException(message);
        } catch (java.io.IOException exception) {
            throw new AiUnavailableException("OpenAI trả về lỗi HTTP nhưng không đọc được phản hồi", exception);
        }
    }

    private String summarizeOpenAiError(int status, String body) {
        if (!StringUtils.hasText(body)) {
            return "OpenAI trả về HTTP " + status;
        }
        try {
            JsonNode error = objectMapper.readTree(body).path("error").path("message");
            if (error.isTextual()) {
                return "OpenAI HTTP " + status + ": " + error.asText();
            }
        } catch (java.io.IOException ignored) {
            // fall through
        }
        String trimmed = body.length() > 300 ? body.substring(0, 300) + "..." : body;
        return "OpenAI HTTP " + status + ": " + trimmed;
    }
}
