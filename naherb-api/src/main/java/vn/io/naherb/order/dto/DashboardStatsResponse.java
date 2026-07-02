package vn.io.naherb.order.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardStatsResponse(
        long totalProducts,
        long activeProducts,
        long pendingOrders,
        long todayOrders,
        long pendingQrPayments,
        BigDecimal monthlyRevenue,
        BigDecimal lastMonthRevenue,
        List<RecentOrderItem> recentOrders,
        List<LowStockItem> lowStockItems,
        List<PendingQrItem> pendingQrItems) {

    public record RecentOrderItem(
            String id,
            String orderCode,
            String receiverName,
            String receiverPhone,
            BigDecimal totalAmount,
            String orderStatus,
            String paymentStatus,
            String createdAt) {}

    public record LowStockItem(
            String id,
            String productName,
            String skuName,
            int stockQuantity,
            String stockStatus,
            String thumbnailUrl) {}

    public record PendingQrItem(
            String id,
            String orderCode,
            BigDecimal totalAmount,
            String createdAt) {}
}
