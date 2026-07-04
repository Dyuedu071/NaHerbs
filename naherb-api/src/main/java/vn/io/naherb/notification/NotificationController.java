package vn.io.naherb.notification;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.security.CurrentAccountHelper;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;

    @GetMapping("/my")
    @Transactional(readOnly = true)
    public List<NotificationDto> getMyNotifications(JwtAuthenticationToken authentication) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        return notificationRepository.findTop20ByAccount_IdOrderByCreatedAtDesc(accountId)
                .stream()
                .map(NotificationDto::from)
                .toList();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<NotificationDto> getAdminNotifications() {
        return notificationRepository.findTop20ByAccountIsNullOrderByCreatedAtDesc()
                .stream()
                .map(NotificationDto::from)
                .toList();
    }

    @PostMapping("/my/{id}/read")
    @Transactional
    public void markMyNotificationAsRead(@PathVariable java.util.UUID id, JwtAuthenticationToken authentication) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        notificationRepository.markAsRead(id, accountId);
    }

    @PostMapping("/admin/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void markAdminNotificationAsRead(@PathVariable java.util.UUID id) {
        // Find and mark as read
        notificationRepository.findById(id).ifPresent(notification -> {
            if (notification.getAccount() == null) {
                notification.setRead(true);
                notificationRepository.save(notification);
            }
        });
    }
}
