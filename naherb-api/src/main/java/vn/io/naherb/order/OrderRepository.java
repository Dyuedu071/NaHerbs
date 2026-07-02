package vn.io.naherb.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.io.naherb.common.enums.OrderStatus;
import vn.io.naherb.common.enums.PaymentMethod;
import vn.io.naherb.common.enums.PaymentStatus;

public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {

    boolean existsByOrderCode(String orderCode);

    Page<Order> findByAccount_Id(UUID accountId, Pageable pageable);

    Optional<Order> findByIdAndAccount_Id(UUID id, UUID accountId);

    long countByStatus(OrderStatus status);

    long countByCreatedAtAfter(Instant after);

    long countByPaymentMethodAndPaymentStatus(PaymentMethod paymentMethod, PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o WHERE o.status IN :statuses AND o.createdAt >= :after")
    BigDecimal sumRevenueByStatusAndCreatedAtAfter(
            @Param("statuses") List<OrderStatus> statuses,
            @Param("after") Instant after);

    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o WHERE o.status IN :statuses AND o.createdAt >= :start AND o.createdAt < :end")
    BigDecimal sumRevenueBetween(
            @Param("statuses") List<OrderStatus> statuses,
            @Param("start") Instant start,
            @Param("end") Instant end);

    List<Order> findByPaymentMethodAndPaymentStatusOrderByCreatedAtDesc(
            PaymentMethod paymentMethod, PaymentStatus paymentStatus, Pageable pageable);
}
