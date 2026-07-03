package vn.io.naherb.order;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import vn.io.naherb.common.enums.PaymentStatus;

@Service
@RequiredArgsConstructor
class PaymentRecordService {

    private final PaymentRepository paymentRepository;
    private final JdbcTemplate jdbcTemplate;

    Payment createForOrder(Order order, PaymentRecordStatus status) {
        if (isPostgreSql()) {
            UUID id = UUID.randomUUID();
            Instant now = Instant.now();
            jdbcTemplate.update(
                    """
                    insert into naherb.payments
                        (id, order_id, method, status, amount, payment_gateway, created_at, updated_at)
                    values
                        (?, ?, ?::naherb.payment_method, ?::naherb.payment_status, ?, ?, ?, ?)
                    """,
                    id,
                    order.getId(),
                    order.getPaymentMethod().name(),
                    status.name(),
                    order.getFinalAmount(),
                    order.getPaymentMethod().name(),
                    Timestamp.from(now),
                    Timestamp.from(now));
            return paymentRepository.findById(id).orElseThrow();
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getFinalAmount());
        payment.setPaymentGateway(order.getPaymentMethod().name());
        return paymentRepository.save(payment);
    }

    void updateStatus(Order order, PaymentStatus paymentStatus) {
        PaymentRecordStatus status = toRecordStatus(paymentStatus);
        Payment payment = paymentRepository
                .findByOrder_Id(order.getId())
                .orElseGet(() -> createForOrder(order, status));

        if (isPostgreSql()) {
            Instant paidAt = paymentStatus == PaymentStatus.PAID ? Instant.now() : payment.getPaidAt();
            jdbcTemplate.update(
                    """
                    update naherb.payments
                    set status = ?::naherb.payment_status,
                        paid_at = ?,
                        updated_at = ?
                    where order_id = ?
                    """,
                    status.name(),
                    paidAt == null ? null : Timestamp.from(paidAt),
                    Timestamp.from(Instant.now()),
                    order.getId());
            return;
        }

        if (paymentStatus == PaymentStatus.PAID) {
            payment.setPaidAt(Instant.now());
        }
        paymentRepository.save(payment);
    }

    static PaymentRecordStatus toRecordStatus(PaymentStatus paymentStatus) {
        return switch (paymentStatus) {
            case PAID -> PaymentRecordStatus.PAID;
            case FAILED -> PaymentRecordStatus.REJECTED;
            case REFUNDED -> PaymentRecordStatus.REFUNDED;
            case COD_PENDING, WAITING_BANK_TRANSFER -> PaymentRecordStatus.PENDING_MANUAL_CONFIRMATION;
            case UNPAID -> PaymentRecordStatus.UNPAID;
        };
    }

    private boolean isPostgreSql() {
        return Boolean.TRUE.equals(jdbcTemplate.execute((ConnectionCallback<Boolean>) connection -> connection
                .getMetaData()
                .getDatabaseProductName()
                .toLowerCase(Locale.ROOT)
                .contains("postgresql")));
    }
}
