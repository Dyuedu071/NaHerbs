package vn.io.naherb.order;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.common.response.ApiResponse;
import vn.io.naherb.order.dto.OrderDetailResponse;
import vn.io.naherb.order.dto.OrderPageResponse;

@RestController
@RequestMapping("/api/orders/my")
@RequiredArgsConstructor
public class CustomerOrderController {

    private final OrderService orderService;

    @GetMapping
    public ApiResponse<OrderPageResponse> listMyOrders(
            JwtAuthenticationToken authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(orderService.listMyOrders(authentication, page, size));
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderDetailResponse> getMyOrder(
            JwtAuthenticationToken authentication, @PathVariable UUID orderId) {
        return ApiResponse.ok(orderService.getMyOrder(authentication, orderId));
    }
}
