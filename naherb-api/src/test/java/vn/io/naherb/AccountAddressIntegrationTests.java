package vn.io.naherb;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import vn.io.naherb.account.AccountAddressRepository;
import vn.io.naherb.account.AccountProfileRepository;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.auth.service.OtpService;
import vn.io.naherb.cart.CartRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Import(InMemoryTokenStoreTestConfig.class)
class AccountAddressIntegrationTests {

    private static final String ACCESS_COOKIE = "NAHERB_ACCESS_TOKEN";
    private static final String REFRESH_COOKIE = "NAHERB_REFRESH_TOKEN";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountProfileRepository accountProfileRepository;

    @Autowired
    private AccountAddressRepository accountAddressRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OtpService otpService;

    @BeforeEach
    void cleanDatabase() {
        cartRepository.deleteAll();
        accountAddressRepository.deleteAll();
        accountProfileRepository.deleteAll();
        accountRepository.deleteAll();
    }

    @Test
    void listAddressesRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/account/addresses")).andExpect(status().isUnauthorized());
    }

    @Test
    void createListUpdateSetDefaultAndDeleteAddress() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie);
        SessionCookies session = login(csrfCookie);

        MvcResult createFirst = mockMvc.perform(post("/api/account/addresses")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "receiverName": "Tuấn Anh",
                                  "receiverPhone": "0901234567",
                                  "email": "ship@naherb.vn",
                                  "provinceCity": "TP. Hồ Chí Minh",
                                  "wardCommune": "Phường Bến Nghé",
                                  "addressDetail": "123 Nguyễn Huệ",
                                  "note": "Gọi trước khi giao"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.isDefault", is(true)))
                .andExpect(jsonPath("$.data.provinceCity", is("TP. Hồ Chí Minh")))
                .andExpect(jsonPath("$.data.addressDetail", is("123 Nguyễn Huệ")))
                .andReturn();

        String firstAddressId = readJsonPath(createFirst, "$.data.id");

        mockMvc.perform(post("/api/account/addresses")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "receiverName": "Người nhận 2",
                                  "receiverPhone": "0907654321",
                                  "provinceCity": "Hà Nội",
                                  "wardCommune": "Phường Cửa Nam",
                                  "addressDetail": "45 Hàng Bông",
                                  "isDefault": true
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.isDefault", is(true)));

        mockMvc.perform(get("/api/account/addresses")
                        .cookie(session.access(), session.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)));

        mockMvc.perform(put("/api/account/addresses/" + firstAddressId)
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "receiverName": "Tuấn Anh (cập nhật)",
                                  "receiverPhone": "0901234567",
                                  "provinceCity": "TP. Hồ Chí Minh",
                                  "wardCommune": "Phường Bến Nghé",
                                  "addressDetail": "456 Lê Lợi"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.receiverName", is("Tuấn Anh (cập nhật)")))
                .andExpect(jsonPath("$.data.addressDetail", is("456 Lê Lợi")));

        mockMvc.perform(patch("/api/account/addresses/" + firstAddressId + "/default")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        mockMvc.perform(delete("/api/account/addresses/" + firstAddressId)
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/account/addresses")
                        .cookie(session.access(), session.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].isDefault", is(true)));
    }

    @Test
    void cannotAccessAnotherAccountsAddress() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie, "user@naherb.vn", "User One");
        SessionCookies session = login(csrfCookie, "user@naherb.vn");

        MvcResult create = mockMvc.perform(post("/api/account/addresses")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "receiverName": "User One",
                                  "receiverPhone": "0901111111",
                                  "provinceCity": "Đà Nẵng",
                                  "wardCommune": "Phường Hải Châu",
                                  "addressDetail": "1 Trần Phú"
                                }
                                """))
                .andExpect(status().isCreated())
                .andReturn();

        String addressId = readJsonPath(create, "$.data.id");

        register(csrfCookie, "other@naherb.vn", "User Two");
        SessionCookies otherSession = login(csrfCookie, "other@naherb.vn");

        mockMvc.perform(put("/api/account/addresses/" + addressId)
                        .cookie(otherSession.access(), otherSession.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "receiverName": "Hacker",
                                  "receiverPhone": "0900000000",
                                  "provinceCity": "Đà Nẵng",
                                  "wardCommune": "Phường Hải Châu",
                                  "addressDetail": "Hack"
                                }
                                """))
                .andExpect(status().isNotFound());
    }

    private String readJsonPath(MvcResult result, String path) throws Exception {
        return com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), path);
    }

    private void register(Cookie csrfCookie) throws Exception {
        register(csrfCookie, "user@naherb.vn", "NaHerb User");
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

    private SessionCookies login(Cookie csrfCookie) throws Exception {
        return login(csrfCookie, "user@naherb.vn");
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

    private record SessionCookies(Cookie access, Cookie refresh) {}
}
