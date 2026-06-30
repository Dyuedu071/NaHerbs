package vn.io.naherb.account;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountAddressRepository extends JpaRepository<AccountAddress, UUID> {

    List<AccountAddress> findByAccount_IdOrderByCreatedAtDesc(UUID accountId);

    Optional<AccountAddress> findByIdAndAccount_Id(UUID id, UUID accountId);

    long countByAccount_Id(UUID accountId);
}
