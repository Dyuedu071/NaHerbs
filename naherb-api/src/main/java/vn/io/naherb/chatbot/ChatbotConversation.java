package vn.io.naherb.chatbot;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.common.enums.ChatConversationStatus;
import vn.io.naherb.account.Account;

@Entity
@Table(name = "chatbot_conversations")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatbotConversation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "session_id", nullable = false, length = 100)
    private String sessionId;

    @Column(name = "lead_id")
    private UUID leadId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatConversationStatus status = ChatConversationStatus.OPEN;

    public ChatbotConversation(String sessionId) {
        this.sessionId = sessionId;
    }
}
