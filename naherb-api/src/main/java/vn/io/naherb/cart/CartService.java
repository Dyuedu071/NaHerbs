package vn.io.naherb.cart;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.cart.dto.AddCartItemRequest;
import vn.io.naherb.cart.dto.CartResponse;
import vn.io.naherb.cart.dto.UpdateCartItemRequest;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.enums.SkuStatus;
import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.exception.ConflictException;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.product.ProductSku;
import vn.io.naherb.product.ProductSkuRepository;
import vn.io.naherb.security.CurrentAccountHelper;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductSkuRepository productSkuRepository;
    private final AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(JwtAuthenticationToken authentication) {
        Account account = requireAccount(authentication);
        Cart cart = cartRepository.findByAccountId(account.getId()).orElse(null);
        if (cart == null) {
            return new CartResponse(null, List.of(), BigDecimal.ZERO);
        }
        return toFreshResponse(cart);
    }

    @Transactional
    public void clearCart(JwtAuthenticationToken authentication) {
        Account account = requireAccount(authentication);
        Cart cart = getOrCreateCart(account);
        cartItemRepository.deleteByCart_Id(cart.getId());
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    @Transactional
    public CartResponse addItem(JwtAuthenticationToken authentication, AddCartItemRequest request) {
        Account account = requireAccount(authentication);
        Cart cart = getOrCreateCart(account);
        ProductSku sku = requirePurchasableSku(request.skuId());

        CartItem item = cartItemRepository
                .findByCart_IdAndSku_Id(cart.getId(), sku.getId())
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setSku(sku);
                    newItem.setQuantity(0);
                    return newItem;
                });

        int desiredQuantity = item.getQuantity() + request.quantity();
        ensureEnoughStock(sku, desiredQuantity);
        item.setQuantity(desiredQuantity);
        cartItemRepository.save(item);
        return recalculateAndMap(cart);
    }

    @Transactional
    public CartResponse updateItem(
            JwtAuthenticationToken authentication, UUID itemId, UpdateCartItemRequest request) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        CartItem item = cartItemRepository
                .findByIdAndCart_Account_Id(itemId, accountId)
                .orElseThrow(() -> new NotFoundException("Cart item not found"));

        ProductSku sku = requirePurchasableSku(item.getSku().getId());
        ensureEnoughStock(sku, request.quantity());
        item.setQuantity(request.quantity());
        cartItemRepository.save(item);
        return recalculateAndMap(item.getCart());
    }

    @Transactional
    public CartResponse removeItem(JwtAuthenticationToken authentication, UUID itemId) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        CartItem item = cartItemRepository
                .findByIdAndCart_Account_Id(itemId, accountId)
                .orElseThrow(() -> new NotFoundException("Cart item not found"));

        Cart cart = item.getCart();
        cartItemRepository.delete(item);
        return recalculateAndMap(cart);
    }

    @Transactional
    public Cart getOrCreateCart(Account account) {
        return cartRepository.findByAccountId(account.getId()).orElseGet(() -> cartRepository.save(new Cart(account)));
    }

    @Transactional
    public CartResponse recalculateAndMap(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCart_IdOrderByCreatedAtAsc(cart.getId());
        BigDecimal subtotal = items.stream()
                .map(CartMapper::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(subtotal);
        cartRepository.save(cart);
        return CartMapper.toResponse(cart, items);
    }

    private CartResponse toFreshResponse(Cart cart) {
        return CartMapper.toResponse(cart, cartItemRepository.findByCart_IdOrderByCreatedAtAsc(cart.getId()));
    }

    private Account requireAccount(JwtAuthenticationToken authentication) {
        return accountRepository
                .findByEmailIgnoreCase(CurrentAccountHelper.requireAccountEmail(authentication))
                .orElseThrow(() -> new NotFoundException("Account not found"));
    }

    private ProductSku requirePurchasableSku(UUID skuId) {
        ProductSku sku = productSkuRepository
                .findById(skuId)
                .orElseThrow(() -> new NotFoundException("Product SKU not found"));
        if (sku.getStatus() != SkuStatus.ACTIVE
                || sku.getStockStatus() == StockStatus.OUT_OF_STOCK
                || sku.getStockQuantity() <= 0
                || sku.getProduct().getStatus() != ContentStatus.PUBLISHED) {
            throw new ConflictException("Product SKU is not available");
        }
        return sku;
    }

    private static void ensureEnoughStock(ProductSku sku, int quantity) {
        if (quantity > sku.getStockQuantity()) {
            throw new ConflictException("Quantity exceeds available stock");
        }
    }
}
