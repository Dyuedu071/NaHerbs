package vn.io.naherb.chatbot.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.io.naherb.chatbot.ChatbotMessage;

public interface ChatbotMessageRepository extends JpaRepository<ChatbotMessage, UUID> {

    List<ChatbotMessage> findTop10ByConversation_IdOrderByCreatedAtDesc(UUID conversationId);
}
