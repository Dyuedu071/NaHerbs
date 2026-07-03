package vn.io.naherb;

import java.util.List;
import java.util.function.Consumer;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import vn.io.naherb.chatbot.ai.OpenAiClient;

@TestConfiguration
public class MockOpenAiTestConfig {

    @Bean
    @Primary
    OpenAiClient mockOpenAiClient() {
        return new OpenAiClient() {
            @Override
            public float[] embed(String text) {
                float[] vector = new float[128];
                int seed = text.toLowerCase().hashCode();
                for (int i = 0; i < vector.length; i++) {
                    vector[i] = ((seed + i * 17L) % 997) / 997f;
                }
                return vector;
            }

            @Override
            public String chat(List<ChatMessage> messages) {
                return buildAnswer(messages);
            }

            @Override
            public void chatStream(List<ChatMessage> messages, Consumer<String> onToken) {
                String answer = buildAnswer(messages);
                for (String chunk : answer.split("(?<=\\s)")) {
                    onToken.accept(chunk);
                }
            }

            private String buildAnswer(List<ChatMessage> messages) {
                String joined = messages.stream()
                        .map(ChatMessage::content)
                        .reduce("", (left, right) -> left + " " + right)
                        .toLowerCase();
                if (joined.contains("cổ vai") || joined.contains("gối")) {
                    return "Bạn có thể tham khảo Gối Công Thái Học Thảo Dược NaHerbs để hỗ trợ thư giãn vùng cổ vai gáy.";
                }
                return "NaHerbs có nhiều sản phẩm thảo dược hỗ trợ thư giãn. Bạn mô tả thêm nhu cầu nhé.";
            }
        };
    }
}
