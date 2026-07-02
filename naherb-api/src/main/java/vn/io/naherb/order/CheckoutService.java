package vn.io.naherb.order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountAddress;
import vn.io.naherb.account.AccountAddressRepository;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.account.dto.UpsertAddressRequest;
import vn.io.naherb.cart.Cart;
import vn.io.naherb.cart.CartItem;
import vn.io.naherb.cart.CartItemRepository;
import vn.io.naherb.cart.CartRepository;
import vn.io.naherb.cart.CartService;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.enums.OrderStatus;
import vn.io.naherb.common.enums.PaymentMethod;
import vn.io.naherb.common.enums.PaymentStatus;
import vn.io.naherb.common.enums.SkuStatus;
import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.exception.BadRequestException;
import vn.io.naherb.exception.ConflictException;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.order.dto.CheckoutRequest;
import vn.io.naherb.order.dto.CheckoutResponse;
import vn.io.naherb.product.ProductSku;
import vn.io.naherb.product.ProductSkuRepository;
import vn.io.naherb.security.CurrentAccountHelper;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private static final ZoneId ORDER_CODE_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter ORDER_CODE_DATE = DateTimeFormatter.BASIC_ISO_DATE;

    private final AccountRepository accountRepository;
    private final AccountAddressRepository accountAddressRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartService cartService;
    private final ProductSkuRepository productSkuRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRecordService paymentRecordService;
    private final QrInstructionService qrInstructionService;

    @Transactional
    public CheckoutResponse checkout(JwtAuthenticationToken authentication, CheckoutRequest request) {
        Account account = requireAccount(authentication);
        Cart cart = cartService.getOrCreateCart(account);
        List<CartItem> cartItems = cartItemRepository.findByCart_IdOrderByCreatedAtAsc(cart.getId());
        if (cartItems.isEmpty()) {
            throw new ConflictException("Cart is empty");
        }

        ShippingSnapshot shipping = resolveShipping(account, request);
        BigDecimal subtotal = cartItems.stream()
                .map(CheckoutService::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setAccount(account);
        order.setOrderCode(generateOrderCode());
        order.setTotalAmount(subtotal);
        order.setShippingFee(BigDecimal.ZERO);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setFinalAmount(subtotal);
        order.setStatus(OrderStatus.PENDING_CONFIRMATION);
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentStatus(initialPaymentStatus(request.paymentMethod()));
        order.setReceiverName(shipping.receiverName());
        order.setReceiverPhone(shipping.receiverPhone());
        order.setReceiverEmail(shipping.email());
        order.setReceiverProvinceCity(shipping.provinceCity());
        order.setReceiverWardCommune(shipping.wardCommune());
        order.setReceiverAddressDetail(shipping.addressDetail());
        order.setReceiverAddressNote(shipping.note());
        order.setShippingAddress(shipping.fullAddress());
        order.setCustomerNote(blankToNull(request.note()));
        Order savedOrder = orderRepository.saveAndFlush(order);

        for (CartItem cartItem : cartItems) {
            ProductSku sku = cartItem.getSku();
            validateCheckoutSku(sku, cartItem.getQuantity());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setSku(sku);
            orderItem.setProductNameSnapshot(sku.getProduct().getName());
            orderItem.setSkuName(sku.getSkuName());
            orderItem.setUnitPrice(sku.getSalePrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(lineTotal(cartItem));
            orderItemRepository.save(orderItem);

            sku.setStockQuantity(sku.getStockQuantity() - cartItem.getQuantity());
            sku.setStockStatus(resolveStockStatus(sku));
            productSkuRepository.save(sku);
        }

        paymentRecordService.createForOrder(
                savedOrder,
                PaymentRecordService.toRecordStatus(savedOrder.getPaymentStatus()));

        cartItemRepository.deleteByCart_Id(cart.getId());
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);

        return new CheckoutResponse(
                savedOrder.getId(),
                savedOrder.getOrderCode(),
                savedOrder.getStatus(),
                savedOrder.getPaymentMethod(),
                savedOrder.getPaymentStatus(),
                savedOrder.getFinalAmount(),
                qrInstructionService.buildFor(savedOrder));
    }

    private ShippingSnapshot resolveShipping(Account account, CheckoutRequest request) {
        if (request.shippingAddressId() != null) {
            return accountAddressRepository
                    .findByIdAndAccount_Id(request.shippingAddressId(), account.getId())
                    .map(CheckoutService::snapshotFromAddress)
                    .orElseThrow(() -> new NotFoundException("Shipping address not found"));
        }

        if (request.shippingAddress() != null) {
            UpsertAddressRequest addressRequest = request.shippingAddress();
            if (Boolean.TRUE.equals(request.saveAddress())) {
                AccountAddress savedAddress = saveInlineAddress(account, addressRequest);
                return snapshotFromAddress(savedAddress);
            }
            return snapshotFromRequest(addressRequest);
        }

        return accountAddressRepository
                .findFirstByAccount_IdAndIsDefaultTrue(account.getId())
                .map(CheckoutService::snapshotFromAddress)
                .orElseThrow(() -> new BadRequestException("Shipping address is required"));
    }

    private AccountAddress saveInlineAddress(Account account, UpsertAddressRequest request) {
        boolean shouldBeDefault =
                accountAddressRepository.countByAccount_Id(account.getId()) == 0 || Boolean.TRUE.equals(request.isDefault());
        if (shouldBeDefault) {
            accountAddressRepository.findByAccount_IdOrderByCreatedAtDesc(account.getId()).forEach(address -> {
                if (address.isDefault()) {
                    address.setDefault(false);
                }
            });
        }

        AccountAddress address = new AccountAddress(
                account,
                request.receiverName().trim(),
                request.receiverPhone().trim(),
                blankToNull(request.email()),
                request.provinceCity().trim(),
                request.wardCommune().trim(),
                request.addressDetail().trim(),
                blankToNull(request.note()),
                shouldBeDefault);
        return accountAddressRepository.save(address);
    }

    private static ShippingSnapshot snapshotFromAddress(AccountAddress address) {
        return new ShippingSnapshot(
                address.getReceiverName(),
                address.getReceiverPhone(),
                address.getReceiverEmail(),
                address.getProvinceName(),
                address.getWardName(),
                address.getAddressLine(),
                address.getNote(),
                OrderMapper.composeAddress(
                        address.getAddressLine(), address.getWardName(), address.getProvinceName()));
    }

    private static ShippingSnapshot snapshotFromRequest(UpsertAddressRequest request) {
        String addressDetail = request.addressDetail().trim();
        String wardCommune = request.wardCommune().trim();
        String provinceCity = request.provinceCity().trim();
        return new ShippingSnapshot(
                request.receiverName().trim(),
                request.receiverPhone().trim(),
                blankToNull(request.email()),
                provinceCity,
                wardCommune,
                addressDetail,
                blankToNull(request.note()),
                OrderMapper.composeAddress(addressDetail, wardCommune, provinceCity));
    }

    private Account requireAccount(JwtAuthenticationToken authentication) {
        return accountRepository
                .findByEmailIgnoreCase(CurrentAccountHelper.requireAccountEmail(authentication))
                .orElseThrow(() -> new NotFoundException("Account not found"));
    }

    private String generateOrderCode() {
        String date = LocalDate.now(ORDER_CODE_ZONE).format(ORDER_CODE_DATE);
        for (int attempt = 0; attempt < 5; attempt++) {
            String suffix = UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
            String orderCode = "NAHERBS-" + date + "-" + suffix;
            if (!orderRepository.existsByOrderCode(orderCode)) {
                return orderCode;
            }
        }
        throw new ConflictException("Could not generate order code");
    }

    private static PaymentStatus initialPaymentStatus(PaymentMethod paymentMethod) {
        return paymentMethod == PaymentMethod.BANK_QR
                ? PaymentStatus.WAITING_BANK_TRANSFER
                : PaymentStatus.COD_PENDING;
    }

    private static void validateCheckoutSku(ProductSku sku, int quantity) {
        if (sku.getStatus() != SkuStatus.ACTIVE
                || sku.getStockStatus() == StockStatus.OUT_OF_STOCK
                || sku.getProduct().getStatus() != ContentStatus.PUBLISHED) {
            throw new ConflictException("Product SKU is not available");
        }
        if (quantity > sku.getStockQuantity()) {
            throw new ConflictException("Quantity exceeds available stock");
        }
    }

    private static BigDecimal lineTotal(CartItem item) {
        return item.getSku().getSalePrice().multiply(BigDecimal.valueOf(item.getQuantity()));
    }

    private static StockStatus resolveStockStatus(ProductSku sku) {
        if (sku.getStockQuantity() <= 0) {
            sku.setStatus(SkuStatus.OUT_OF_STOCK);
            return StockStatus.OUT_OF_STOCK;
        }
        if (sku.getStockQuantity() <= sku.getLowStockThreshold()) {
            return StockStatus.LOW_STOCK;
        }
        return StockStatus.IN_STOCK;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private record ShippingSnapshot(
            String receiverName,
            String receiverPhone,
            String email,
            String provinceCity,
            String wardCommune,
            String addressDetail,
            String note,
            String fullAddress) {}
}
