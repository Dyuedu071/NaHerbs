package vn.io.naherb.notification;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.exception.NotFoundException;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void notifyAdmins(String title, String message, String link) {
        Notification notification = new Notification(null, title, message, link);
        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = NotificationDto.from(saved);
        
        // Broadcast to all admins subscribed to /topic/admin/notifications
        messagingTemplate.convertAndSend("/topic/admin/notifications", dto);
    }

    @Transactional
    public void notifyUser(UUID accountId, String title, String message, String link) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        
        Notification notification = new Notification(account, title, message, link);
        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = NotificationDto.from(saved);
        
        // Send to specific user. Spring Security user must match accountId or email
        // We will send to /topic/user/{accountId}/notifications for simplicity if user principal is hard to match
        // Or use /queue/notifications if Spring Security Principal is configured correctly.
        // For simplicity and considering we use UUIDs, let's use a specific topic:
        messagingTemplate.convertAndSend("/topic/user/" + accountId + "/notifications", dto);
    }
}
