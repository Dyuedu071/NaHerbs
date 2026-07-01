package vn.io.naherb.order;

import java.util.List;
import org.springframework.data.domain.Page;
import vn.io.naherb.order.dto.OrderDetailResponse;
import vn.io.naherb.order.dto.OrderItemResponse;
import vn.io.naherb.order.dto.OrderPageResponse;
import vn.io.naherb.order.dto.OrderSummaryResponse;
import vn.io.naherb.order.dto.QrInstructionResponse;
import vn.io.naherb.order.dto.ShippingAddressSnapshotResponse;

final class OrderMapper {

    private OrderMapper() {}

    static OrderSummaryResponse toSummary(Order order) {
        return new OrderSummaryResponse(
                order.getId(),
                order.getOrderCode(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getFinalAmount(),
                order.getCreatedAt());
    }

    static OrderPageResponse toPage(Page<Order> page) {
        return new OrderPageResponse(
                page.getContent().stream().map(OrderMapper::toSummary).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }

    static OrderDetailResponse toDetail(
            Order order, List<OrderItem> items, QrInstructionResponse qrInstruction) {
        return new OrderDetailResponse(
                order.getId(),
                order.getOrderCode(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getFinalAmount(),
                order.getCreatedAt(),
                order.getCustomerNote(),
                items.stream().map(OrderMapper::toItem).toList(),
                qrInstruction,
                shippingAddress(order));
    }

    private static OrderItemResponse toItem(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getSku() == null ? null : item.getSku().getId(),
                item.getProductNameSnapshot(),
                item.getSkuName(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getTotalPrice());
    }

    private static ShippingAddressSnapshotResponse shippingAddress(Order order) {
        String fullAddress = blankToNull(order.getShippingAddress());
        if (fullAddress == null) {
            fullAddress = composeAddress(
                    order.getReceiverAddressDetail(),
                    order.getReceiverWardCommune(),
                    order.getReceiverProvinceCity());
        }

        return new ShippingAddressSnapshotResponse(
                order.getReceiverName(),
                order.getReceiverPhone(),
                order.getReceiverEmail(),
                order.getReceiverProvinceCity(),
                order.getReceiverWardCommune(),
                order.getReceiverAddressDetail(),
                order.getReceiverAddressNote(),
                fullAddress);
    }

    static String composeAddress(String addressDetail, String wardCommune, String provinceCity) {
        return String.join(
                ", ",
                List.of(addressDetail, wardCommune, provinceCity).stream()
                        .filter(value -> value != null && !value.isBlank())
                        .toList());
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
