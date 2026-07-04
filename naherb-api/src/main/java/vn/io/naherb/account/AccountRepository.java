package vn.io.naherb.account;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    Optional<Account> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("SELECT a FROM Account a LEFT JOIN AccountProfile ap ON ap.account = a WHERE LOWER(a.email) = LOWER(:login) OR ap.phone = :login")
    Optional<Account> findByEmailOrPhone(@Param("login") String login);

    java.util.List<Account> findByRole(Role role);
}
