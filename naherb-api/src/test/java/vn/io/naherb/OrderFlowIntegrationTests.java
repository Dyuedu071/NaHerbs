package vn.io.naherb;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.Cookie;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.support.TransactionTemplate;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountAddressRepository;
import vn.io.naherb.account.AccountProfileRepository;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.account.Role;
import vn.io.naherb.auth.service.OtpService;
import vn.io.naherb.cart.CartItemRepository;
import vn.io.naherb.cart.CartRepository;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.enums.SkuStatus;
import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.order.OrderItemRepository;
import vn.io.naherb.order.OrderRepository;
import vn.io.naherb.order.PaymentRepository;
import vn.io.naherb.product.entity.Product;
import vn.io.naherb.product.entity.ProductSku;
import vn.io.naherb.product.repository.ProductSkuRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Import(InMemoryTokenStoreTestConfig.class)
class OrderFlowIntegrationTests {

    private static final String ACCESS_COOKIE = "NAHERB_ACCESS_TOKEN";
    private static final String REFRESH_COOKIE = "NAHERB_REFRESH_TOKEN";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountProfileRepository accountProfileRepository;

    @Autowired
    private AccountAddressRepository accountAddressRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductSkuRepository productSkuRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpService otpService;

    @BeforeEach
    void cleanDatabase() {
        transactionTemplate.executeWithoutResult(status -> {
            paymentRepository.deleteAllInBatch();
            orderItemRepository.deleteAllInBatch();
            orderRepository.deleteAllInBatch();
            cartItemRepository.deleteAllInBatch();
            cartRepository.deleteAllInBatch();
            accountAddressRepository.deleteAllInBatch();
            accountProfileRepository.deleteAllInBatch();
            accountRepository.deleteAllInBatch();
            productSkuRepository.deleteAllInBatch();
            entityManager.createQuery("delete from Product").executeUpdate();
        });
    }

    @Test
    void cartCheckoutAndMyOrdersFlow() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie, "customer@naherb.vn", "Customer");
        SessionCookies session = login(csrfCookie, "customer@naherb.vn");
        UUID skuId = createSku("Herbal Shampoo", "herbal-shampoo", "Bottle 250ml", 5);

        MvcResult add = mockMvc.perform(post("/api/cart/items")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "skuId": "%s",
                                  "quantity": 2
                                }
                                """.formatted(skuId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productSlug", is("herbal-shampoo")))
                .andExpect(jsonPath("$.data.items[0].quantity", is(2)))
                .andReturn();

        String itemId = readJsonPath(add, "$.data.items[0].id");

        mockMvc.perform(patch("/api/cart/items/" + itemId)
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"quantity\":3}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].quantity", is(3)));

        mockMvc.perform(delete("/api/cart/items/" + itemId)
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(0)));

        mockMvc.perform(post("/api/cart/items")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "skuId": "%s",
                                  "quantity": 1
                                }
                                """.formatted(skuId)))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/cart")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/cart")
                        .cookie(session.access(), session.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(0)));

        mockMvc.perform(post("/api/cart/items")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "skuId": "%s",
                                  "quantity": 2
                                }
                                """.formatted(skuId)))
                .andExpect(status().isOk());

        MvcResult checkout = mockMvc.perform(post("/api/checkout")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "paymentMethod": "BANK_QR",
                                  "saveAddress": true,
                                  "note": "Call before delivery",
                                  "shippingAddress": {
                                    "receiverName": "Customer",
                                    "receiverPhone": "0901234567",
                                    "email": "ship@naherb.vn",
                                    "provinceCity": "Ho Chi Minh",
                                    "wardCommune": "Ben Nghe",
                                    "addressDetail": "123 Nguyen Hue"
                                  }
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.orderStatus", is("PENDING_CONFIRMATION")))
                .andExpect(jsonPath("$.data.paymentStatus", is("WAITING_BANK_TRANSFER")))
                .andExpect(jsonPath("$.data.qrInstruction.transferContent").exists())
                .andReturn();

        String orderId = readJsonPath(checkout, "$.data.orderId");

        mockMvc.perform(get("/api/cart")
                        .cookie(session.access(), session.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(0)));

        mockMvc.perform(get("/api/orders/my")
                        .cookie(session.access(), session.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].paymentMethod", is("BANK_QR")));

        mockMvc.perform(get("/api/orders/my/" + orderId)
                        .cookie(session.access(), session.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productNameSnapshot", is("Herbal Shampoo")))
                .andExpect(jsonPath("$.data.shippingAddress.provinceCity", is("Ho Chi Minh")))
                .andExpect(jsonPath("$.data.note", is("Call before delivery")));

        productSkuRepository.findById(skuId)
                .ifPresent(sku -> org.assertj.core.api.Assertions.assertThat(sku.getStockQuantity()).isEqualTo(3));
    }

    @Test
    void orderOwnershipAndAdminOrderManagement() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie, "owner@naherb.vn", "Owner");
        SessionCookies ownerSession = login(csrfCookie, "owner@naherb.vn");
        UUID skuId = createSku("Herbal Soap", "herbal-soap", "Soap bar", 4);

        mockMvc.perform(post("/api/cart/items")
                        .cookie(ownerSession.access(), ownerSession.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "skuId": "%s",
                                  "quantity": 1
                                }
                                """.formatted(skuId)))
                .andExpect(status().isOk());

        MvcResult checkout = mockMvc.perform(post("/api/checkout")
                        .cookie(ownerSession.access(), ownerSession.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "paymentMethod": "COD",
                                  "shippingAddress": {
                                    "receiverName": "Owner",
                                    "receiverPhone": "0901111111",
                                    "provinceCity": "Da Nang",
                                    "wardCommune": "Hai Chau",
                                    "addressDetail": "1 Tran Phu"
                                  }
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.paymentStatus", is("COD_PENDING")))
                .andReturn();

        String orderId = readJsonPath(checkout, "$.data.orderId");

        register(csrfCookie, "other@naherb.vn", "Other");
        SessionCookies otherSession = login(csrfCookie, "other@naherb.vn");

        mockMvc.perform(get("/api/orders/my/" + orderId)
                        .cookie(otherSession.access(), otherSession.refresh(), csrfCookie))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/admin/orders")
                        .cookie(otherSession.access(), otherSession.refresh(), csrfCookie))
                .andExpect(status().isForbidden());

        SessionCookies adminSession = createAdminAndLogin(csrfCookie);

        mockMvc.perform(get("/api/admin/orders")
                        .param("paymentStatus", "COD_PENDING")
                        .cookie(adminSession.access(), adminSession.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].id", is(orderId)));

        mockMvc.perform(patch("/api/admin/orders/" + orderId + "/status")
                        .cookie(adminSession.access(), adminSession.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "orderStatus": "CONFIRMED",
                                  "note": "Confirmed by admin"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/admin/orders/" + orderId + "/payment-status")
                        .cookie(adminSession.access(), adminSession.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "paymentStatus": "PAID",
                                  "note": "Paid"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/admin/orders/" + orderId)
                        .cookie(adminSession.access(), adminSession.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.orderStatus", is("CONFIRMED")))
                .andExpect(jsonPath("$.data.paymentStatus", is("PAID")));
    }

    private UUID createSku(String productName, String slug, String skuName, int stockQuantity) {
        return transactionTemplate.execute(status -> {
            Product product = BeanUtils.instantiateClass(Product.class);
            product.setName(productName);
            product.setSlug(slug);
            product.setStatus(ContentStatus.PUBLISHED);
            entityManager.persist(product);

            ProductSku sku = BeanUtils.instantiateClass(ProductSku.class);
            sku.setProduct(product);
            sku.setSkuCode(slug + "-001");
            sku.setSkuName(skuName);
            sku.setSalePrice(BigDecimal.valueOf(120000));
            sku.setStockQuantity(stockQuantity);
            sku.setLowStockThreshold(2);
            sku.setStatus(SkuStatus.ACTIVE);
            sku.setStockStatus(StockStatus.IN_STOCK);
            entityManager.persist(sku);
            entityManager.flush();
            return sku.getId();
        });
    }

    private SessionCookies createAdminAndLogin(Cookie csrfCookie) throws Exception {
        Account admin = new Account("admin@naherb.vn", passwordEncoder.encode("password123"), "Admin");
        admin.setRole(Role.ADMIN);
        accountRepository.save(admin);
        return login(csrfCookie, "admin@naherb.vn");
    }

    private void register(Cookie csrfCookie, String email, String name) throws Exception {
        String otp = otpService.generateAndStoreOtp(email, "{}");
        mockMvc.perform(post("/api/auth/register")
                        .cookie(csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "password123",
                                  "name": "%s",
                                  "otp": "%s"
                                }
                                """.formatted(email, name, otp)))
                .andExpect(status().isCreated());
    }

    private SessionCookies login(Cookie csrfCookie, String email) throws Exception {
        MvcResult login = mockMvc.perform(post("/api/auth/login")
                        .cookie(csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "password123"
                                }
                                """.formatted(email)))
                .andExpect(status().isOk())
                .andReturn();

        return new SessionCookies(
                login.getResponse().getCookie(ACCESS_COOKIE),
                login.getResponse().getCookie(REFRESH_COOKIE));
    }

    private Cookie fetchCsrfCookie() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/auth/csrf"))
                .andExpect(status().isOk())
                .andReturn();
        return result.getResponse().getCookie("XSRF-TOKEN");
    }

    private String readJsonPath(MvcResult result, String path) throws Exception {
        return com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), path);
    }

    private record SessionCookies(Cookie access, Cookie refresh) {}
}
