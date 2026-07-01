package vn.io.naherb.order;

import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.common.enums.OrderStatus;
import vn.io.naherb.common.enums.PaymentMethod;
import vn.io.naherb.common.enums.PaymentStatus;
import vn.io.naherb.common.response.ApiResponse;
import vn.io.naherb.order.dto.OrderDetailResponse;
import vn.io.naherb.order.dto.OrderPageResponse;
import vn.io.naherb.order.dto.UpdateOrderStatusRequest;
import vn.io.naherb.order.dto.UpdatePaymentStatusRequest;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ApiResponse<OrderPageResponse> listOrders(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(orderService.listAdminOrders(
                keyword, orderStatus, paymentStatus, paymentMethod, page, size));
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderDetailResponse> getOrder(@PathVariable UUID orderId) {
        return ApiResponse.ok(orderService.getAdminOrder(orderId));
    }

    @PatchMapping("/{orderId}/status")
    public ApiResponse<Void> updateStatus(
            @PathVariable UUID orderId, @Valid @RequestBody UpdateOrderStatusRequest request) {
        orderService.updateOrderStatus(orderId, request);
        return ApiResponse.ok(null);
    }

    @PatchMapping("/{orderId}/payment-status")
    public ApiResponse<Void> updatePaymentStatus(
            @PathVariable UUID orderId, @Valid @RequestBody UpdatePaymentStatusRequest request) {
        orderService.updatePaymentStatus(orderId, request);
        return ApiResponse.ok(null);
    }
}
