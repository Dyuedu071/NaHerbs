package vn.io.naherb.order;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import vn.io.naherb.common.entity.BaseEntity;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_gateway", length = 50)
    private String paymentGateway;

    @Column(name = "gateway_response", columnDefinition = "TEXT")
    private String gatewayResponse;

    @Column(name = "paid_at")
    private Instant paidAt;
}
