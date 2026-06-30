package vn.io.naherb.account;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountProfileRepository extends JpaRepository<AccountProfile, UUID> {
    Optional<AccountProfile> findByAccountId(UUID accountId);

    boolean existsByPhone(String phone);

    boolean existsByPhoneAndAccount_IdNot(String phone, UUID accountId);
}
