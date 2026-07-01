package vn.io.naherb.chatbot.ai;

import java.util.List;

public interface OpenAiClient {

    float[] embed(String text);

    String chat(List<ChatMessage> messages);

    record ChatMessage(String role, String content) {}
}
