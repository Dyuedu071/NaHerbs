package vn.io.naherb.order;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {

    boolean existsByOrderCode(String orderCode);

    Page<Order> findByAccount_Id(UUID accountId, Pageable pageable);

    Optional<Order> findByIdAndAccount_Id(UUID id, UUID accountId);
}
