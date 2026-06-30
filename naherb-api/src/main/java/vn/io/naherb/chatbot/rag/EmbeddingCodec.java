package vn.io.naherb.chatbot.rag;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmbeddingCodec {

    private final ObjectMapper objectMapper;

    public String encode(float[] vector) {
        try {
            return objectMapper.writeValueAsString(vector);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Không thể serialize embedding", exception);
        }
    }

    public float[] decode(String json) {
        try {
            return objectMapper.readValue(json, float[].class);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Không thể deserialize embedding", exception);
        }
    }

    public static double cosineSimilarity(float[] left, float[] right) {
        if (left.length != right.length || left.length == 0) {
            return 0.0;
        }
        double dot = 0.0;
        double normLeft = 0.0;
        double normRight = 0.0;
        for (int i = 0; i < left.length; i++) {
            dot += left[i] * right[i];
            normLeft += left[i] * left[i];
            normRight += right[i] * right[i];
        }
        if (normLeft == 0.0 || normRight == 0.0) {
            return 0.0;
        }
        return dot / (Math.sqrt(normLeft) * Math.sqrt(normRight));
    }
}
