package vn.io.naherb.chatbot.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.io.naherb.chatbot.ChatbotConfig;

public interface ChatbotConfigRepository extends JpaRepository<ChatbotConfig, UUID> {

    Optional<ChatbotConfig> findByConfigKey(String configKey);
}
