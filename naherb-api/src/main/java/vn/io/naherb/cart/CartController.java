package vn.io.naherb.cart;

import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.cart.dto.AddCartItemRequest;
import vn.io.naherb.cart.dto.CartResponse;
import vn.io.naherb.cart.dto.UpdateCartItemRequest;
import vn.io.naherb.common.response.ApiResponse;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getCart(JwtAuthenticationToken authentication) {
        return ApiResponse.ok(cartService.getCart(authentication));
    }

    @DeleteMapping
    public ApiResponse<Void> clearCart(JwtAuthenticationToken authentication) {
        cartService.clearCart(authentication);
        return ApiResponse.ok(null);
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addItem(
            JwtAuthenticationToken authentication, @Valid @RequestBody AddCartItemRequest request) {
        return ApiResponse.ok(cartService.addItem(authentication, request));
    }

    @PatchMapping("/items/{itemId}")
    public ApiResponse<CartResponse> updateItem(
            JwtAuthenticationToken authentication,
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return ApiResponse.ok(cartService.updateItem(authentication, itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ApiResponse<CartResponse> removeItem(
            JwtAuthenticationToken authentication, @PathVariable UUID itemId) {
        return ApiResponse.ok(cartService.removeItem(authentication, itemId));
    }
}
