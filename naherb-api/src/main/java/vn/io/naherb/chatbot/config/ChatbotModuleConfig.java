package vn.io.naherb.chatbot.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({AiProperties.class, ChatbotProperties.class})
public class ChatbotModuleConfig {}
