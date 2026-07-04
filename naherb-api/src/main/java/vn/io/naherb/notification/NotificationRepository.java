package vn.io.naherb.notification;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    
    List<Notification> findTop20ByAccount_IdOrderByCreatedAtDesc(UUID accountId);
    
    // For admins (account is null)
    List<Notification> findTop20ByAccountIsNullOrderByCreatedAtDesc();

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :id AND (n.account.id = :accountId OR n.account IS NULL)")
    int markAsRead(UUID id, UUID accountId);

    long countByAccount_IdAndIsReadFalse(UUID accountId);

    long countByAccountIsNullAndIsReadFalse();

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.account.id = :accountId AND n.isRead = false")
    int markAllAsReadByAccountId(UUID accountId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.account IS NULL AND n.isRead = false")
    int markAllAsReadByAccountIsNull();
}
