package vn.io.naherb.cart;

import java.math.BigDecimal;
import java.util.List;
import vn.io.naherb.cart.dto.CartItemResponse;
import vn.io.naherb.cart.dto.CartResponse;
import vn.io.naherb.product.entity.ProductSku;

final class CartMapper {

    private CartMapper() {}

    static CartResponse toResponse(Cart cart, List<CartItem> items) {
        BigDecimal subtotal = items.stream()
                .map(CartMapper::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(
                cart.getId(),
                items.stream().map(CartMapper::toItemResponse).toList(),
                subtotal);
    }

    static CartItemResponse toItemResponse(CartItem item) {
        ProductSku sku = item.getSku();
        String thumbnailUrl = sku.getThumbnailMedia() == null ? null : sku.getThumbnailMedia().getUrl();
        return new CartItemResponse(
                item.getId(),
                sku.getId(),
                sku.getProduct().getName(),
                sku.getProduct().getSlug(),
                sku.getSkuName(),
                thumbnailUrl,
                sku.getSalePrice(),
                item.getQuantity(),
                lineTotal(item),
                sku.getStockQuantity());
    }

    static BigDecimal lineTotal(CartItem item) {
        return item.getSku().getSalePrice().multiply(BigDecimal.valueOf(item.getQuantity()));
    }
}
