package vn.io.naherb.chatbot.ai;

import java.util.List;
import java.util.function.Consumer;

public interface OpenAiClient {

    float[] embed(String text);

    String chat(List<ChatMessage> messages);

    void chatStream(List<ChatMessage> messages, Consumer<String> onToken);

    record ChatMessage(String role, String content) {}
}
