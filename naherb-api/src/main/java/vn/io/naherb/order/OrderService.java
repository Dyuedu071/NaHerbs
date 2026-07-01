package vn.io.naherb.order;

import jakarta.persistence.criteria.JoinType;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.common.enums.OrderStatus;
import vn.io.naherb.common.enums.PaymentMethod;
import vn.io.naherb.common.enums.PaymentStatus;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.order.dto.OrderDetailResponse;
import vn.io.naherb.order.dto.OrderPageResponse;
import vn.io.naherb.order.dto.UpdateOrderStatusRequest;
import vn.io.naherb.order.dto.UpdatePaymentStatusRequest;
import vn.io.naherb.security.CurrentAccountHelper;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final AccountRepository accountRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final QrInstructionService qrInstructionService;

    @Transactional(readOnly = true)
    public OrderPageResponse listMyOrders(JwtAuthenticationToken authentication, int page, int size) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        return OrderMapper.toPage(orderRepository.findByAccount_Id(accountId, pageRequest(page, size, 10)));
    }

    @Transactional(readOnly = true)
    public OrderDetailResponse getMyOrder(JwtAuthenticationToken authentication, UUID orderId) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        Order order = orderRepository
                .findByIdAndAccount_Id(orderId, accountId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        return toDetail(order);
    }

    @Transactional(readOnly = true)
    public OrderPageResponse listAdminOrders(
            String keyword,
            OrderStatus orderStatus,
            PaymentStatus paymentStatus,
            PaymentMethod paymentMethod,
            int page,
            int size) {
        Specification<Order> spec = Specification.where(null);

        if (keyword != null && !keyword.isBlank()) {
            String like = "%" + keyword.trim().toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((root, query, builder) -> {
                var account = root.join("account", JoinType.LEFT);
                return builder.or(
                        builder.like(builder.lower(root.get("orderCode")), like),
                        builder.like(builder.lower(root.get("receiverName")), like),
                        builder.like(builder.lower(root.get("receiverPhone")), like),
                        builder.like(builder.lower(account.get("email")), like),
                        builder.like(builder.lower(account.get("name")), like));
            });
        }
        if (orderStatus != null) {
            spec = spec.and((root, query, builder) -> builder.equal(root.get("status"), orderStatus));
        }
        if (paymentStatus != null) {
            spec = spec.and((root, query, builder) -> builder.equal(root.get("paymentStatus"), paymentStatus));
        }
        if (paymentMethod != null) {
            spec = spec.and((root, query, builder) -> builder.equal(root.get("paymentMethod"), paymentMethod));
        }

        return OrderMapper.toPage(orderRepository.findAll(spec, pageRequest(page, size, 20)));
    }

    @Transactional(readOnly = true)
    public OrderDetailResponse getAdminOrder(UUID orderId) {
        Order order = findOrder(orderId);
        return toDetail(order);
    }

    @Transactional
    public void updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
        Order order = findOrder(orderId);
        order.setStatus(request.orderStatus());
        if (request.note() != null && !request.note().isBlank()) {
            order.setAdminNote(request.note().trim());
        }
        orderRepository.save(order);
    }

    @Transactional
    public void updatePaymentStatus(UUID orderId, UpdatePaymentStatusRequest request) {
        Order order = findOrder(orderId);
        order.setPaymentStatus(request.paymentStatus());
        if (request.note() != null && !request.note().isBlank()) {
            order.setAdminNote(request.note().trim());
        }
        orderRepository.save(order);

        Payment payment = paymentRepository.findByOrder_Id(order.getId()).orElseGet(() -> {
            Payment newPayment = new Payment();
            newPayment.setOrder(order);
            newPayment.setAmount(order.getFinalAmount());
            newPayment.setPaymentGateway(order.getPaymentMethod().name());
            return newPayment;
        });
        if (request.paymentStatus() == PaymentStatus.PAID) {
            payment.setPaidAt(Instant.now());
        }
        paymentRepository.save(payment);
    }

    private OrderDetailResponse toDetail(Order order) {
        return OrderMapper.toDetail(
                order,
                orderItemRepository.findByOrder_IdOrderByCreatedAtAsc(order.getId()),
                qrInstructionService.buildFor(order));
    }

    private Order findOrder(UUID orderId) {
        return orderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("Order not found"));
    }

    private static PageRequest pageRequest(int page, int size, int defaultSize) {
        int normalizedPage = Math.max(page, 0);
        int normalizedSize = size <= 0 ? defaultSize : Math.min(size, 100);
        return PageRequest.of(normalizedPage, normalizedSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
