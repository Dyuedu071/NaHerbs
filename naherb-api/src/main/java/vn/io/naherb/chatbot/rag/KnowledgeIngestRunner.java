package vn.io.naherb.chatbot.rag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import vn.io.naherb.chatbot.config.ChatbotProperties;

@Component
@RequiredArgsConstructor
@Slf4j
public class KnowledgeIngestRunner {

    private final KnowledgeIngestService knowledgeIngestService;
    private final ChatbotProperties chatbotProperties;

    @EventListener(ApplicationReadyEvent.class)
    public void ingestOnStartup() {
        if (!chatbotProperties.isIngestOnStartup()) {
            return;
        }
        var directory = knowledgeIngestService.resolveKnowledgeDirectory();
        Thread ingestThread = new Thread(
                () -> {
                    log.info("Bắt đầu ingest knowledge (nền) từ {}", directory.toAbsolutePath());
                    knowledgeIngestService.ingestDirectory(directory);
                },
                "knowledge-ingest");
        ingestThread.setDaemon(true);
        ingestThread.start();
    }
}
