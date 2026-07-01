package vn.io.naherb.chatbot.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.io.naherb.chatbot.ChatbotConversation;

public interface ChatbotConversationRepository extends JpaRepository<ChatbotConversation, UUID> {

    Optional<ChatbotConversation> findByIdAndSessionId(UUID id, String sessionId);
}
