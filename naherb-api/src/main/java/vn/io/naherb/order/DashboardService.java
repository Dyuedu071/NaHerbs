package vn.io.naherb.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.enums.OrderStatus;
import vn.io.naherb.common.enums.PaymentMethod;
import vn.io.naherb.common.enums.PaymentStatus;
import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.order.dto.DashboardStatsResponse;
import vn.io.naherb.order.dto.DashboardStatsResponse.LowStockItem;
import vn.io.naherb.order.dto.DashboardStatsResponse.PendingQrItem;
import vn.io.naherb.order.dto.DashboardStatsResponse.RecentOrderItem;
import vn.io.naherb.product.entity.ProductSku;
import vn.io.naherb.product.repository.ProductRepository;
import vn.io.naherb.product.repository.ProductSkuRepository;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductSkuRepository productSkuRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        // Product counts
        long totalProducts = productRepository.count();
        long activeProducts = productRepository.countByStatus(ContentStatus.PUBLISHED);

        // Order counts
        Instant todayStart = LocalDate.now(VN_ZONE)
                .atStartOfDay(VN_ZONE)
                .toInstant();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING_CONFIRMATION);
        long todayOrders = orderRepository.countByCreatedAtAfter(todayStart);

        // Pending QR payments
        long pendingQrPayments = orderRepository.countByPaymentMethodAndPaymentStatus(
                PaymentMethod.BANK_QR, PaymentStatus.WAITING_BANK_TRANSFER);

        // Monthly revenue (from completed/paid orders this month)
        ZonedDateTime firstDayOfMonth = LocalDate.now(VN_ZONE)
                .with(TemporalAdjusters.firstDayOfMonth())
                .atStartOfDay(VN_ZONE);
        Instant monthStart = firstDayOfMonth.toInstant();

        BigDecimal monthlyRevenue = orderRepository.sumRevenueByStatusAndCreatedAtAfter(
                List.of(OrderStatus.COMPLETED, OrderStatus.CONFIRMED, OrderStatus.PACKING, OrderStatus.SHIPPING),
                monthStart);
        if (monthlyRevenue == null) {
            monthlyRevenue = BigDecimal.ZERO;
        }

        // Last month revenue for comparison
        ZonedDateTime firstDayOfLastMonth = firstDayOfMonth.minusMonths(1);
        Instant lastMonthStart = firstDayOfLastMonth.toInstant();
        Instant lastMonthEnd = monthStart;

        BigDecimal lastMonthRevenue = orderRepository.sumRevenueBetween(
                List.of(OrderStatus.COMPLETED, OrderStatus.CONFIRMED, OrderStatus.PACKING, OrderStatus.SHIPPING),
                lastMonthStart,
                lastMonthEnd);
        if (lastMonthRevenue == null) {
            lastMonthRevenue = BigDecimal.ZERO;
        }

        // Recent orders (latest 5)
        List<Order> recentOrders = orderRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent();

        List<RecentOrderItem> recentOrderItems = recentOrders.stream()
                .map(order -> new RecentOrderItem(
                        order.getId().toString(),
                        order.getOrderCode(),
                        order.getReceiverName(),
                        order.getReceiverPhone(),
                        order.getFinalAmount(),
                        order.getStatus().name(),
                        order.getPaymentStatus().name(),
                        order.getCreatedAt().toString()))
                .toList();

        // Low stock items (top 5)
        List<ProductSku> lowStockSkus = productSkuRepository
                .findByStockStatusInOrderByStockQuantityAsc(
                        List.of(StockStatus.LOW_STOCK, StockStatus.OUT_OF_STOCK),
                        PageRequest.of(0, 5));

        List<LowStockItem> lowStockItems = lowStockSkus.stream()
                .map(sku -> new LowStockItem(
                        sku.getId().toString(),
                        sku.getProduct().getName(),
                        sku.getSkuName(),
                        sku.getStockQuantity(),
                        sku.getStockStatus().name(),
                        sku.getThumbnailMedia() != null ? sku.getThumbnailMedia().getUrl() : null))
                .toList();

        // Pending QR payment orders (top 5)
        List<Order> pendingQrOrders = orderRepository
                .findByPaymentMethodAndPaymentStatusOrderByCreatedAtDesc(
                        PaymentMethod.BANK_QR,
                        PaymentStatus.WAITING_BANK_TRANSFER,
                        PageRequest.of(0, 5));

        List<PendingQrItem> pendingQrItems = pendingQrOrders.stream()
                .map(order -> new PendingQrItem(
                        order.getId().toString(),
                        order.getOrderCode(),
                        order.getFinalAmount(),
                        order.getCreatedAt().toString()))
                .toList();

        return new DashboardStatsResponse(
                totalProducts,
                activeProducts,
                pendingOrders,
                todayOrders,
                pendingQrPayments,
                monthlyRevenue,
                lastMonthRevenue,
                recentOrderItems,
                lowStockItems,
                pendingQrItems);
    }
}
