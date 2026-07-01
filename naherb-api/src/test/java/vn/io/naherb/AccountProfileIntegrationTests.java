package vn.io.naherb;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
class AccountProfileIntegrationTests {

    private static final String ACCESS_COOKIE = "NAHERB_ACCESS_TOKEN";
    private static final String REFRESH_COOKIE = "NAHERB_REFRESH_TOKEN";

    @Autowired
    private MockMvc mockMvc;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.cloudinary.Cloudinary cloudinary;

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
    void getProfileRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/account/profile")).andExpect(status().isUnauthorized());
    }

    @Test
    void getAndUpdateProfileForAuthenticatedCustomer() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie);
        SessionCookies session = login(csrfCookie);

        mockMvc.perform(get("/api/account/profile")
                        .cookie(session.access(), session.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", is("NaHerb User")))
                .andExpect(jsonPath("$.data.contactEmail", is("user@naherb.vn")))
                .andExpect(jsonPath("$.data.accountId", notNullValue()));

        mockMvc.perform(put("/api/account/profile")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Tuấn Anh",
                                  "phone": "0901234567",
                                  "contactEmail": "contact@naherb.vn",
                                  "avatarUrl": "https://cdn.naherb.vn/avatar.png"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.fullName", is("Tuấn Anh")))
                .andExpect(jsonPath("$.data.phone", is("0901234567")))
                .andExpect(jsonPath("$.data.contactEmail", is("contact@naherb.vn")))
                .andExpect(jsonPath("$.data.avatarUrl", is("https://cdn.naherb.vn/avatar.png")));

        mockMvc.perform(get("/api/auth/me")
                        .cookie(session.access(), session.refresh(), csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Tuấn Anh")));
    }

    @Test
    void updateProfileRejectsDuplicatePhone() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie, "user@naherb.vn", "NaHerb User", null);
        SessionCookies firstSession = login(csrfCookie, "user@naherb.vn");

        mockMvc.perform(put("/api/account/profile")
                        .cookie(firstSession.access(), firstSession.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "User One",
                                  "phone": "0909999999"
                                }
                                """))
                .andExpect(status().isOk());

        register(csrfCookie, "other@naherb.vn", "Other User", null);
        SessionCookies secondSession = login(csrfCookie, "other@naherb.vn");

        mockMvc.perform(put("/api/account/profile")
                        .cookie(secondSession.access(), secondSession.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "User Two",
                                  "phone": "0909999999"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", is("Số điện thoại đã được sử dụng")));
    }

    @Test
    void uploadAvatarForAuthenticatedCustomer() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie);
        SessionCookies session = login(csrfCookie);

        com.cloudinary.Uploader uploader = org.mockito.Mockito.mock(com.cloudinary.Uploader.class);
        org.mockito.Mockito.when(cloudinary.uploader()).thenReturn(uploader);
        org.mockito.Mockito.when(uploader.upload(org.mockito.ArgumentMatchers.any(byte[].class), org.mockito.ArgumentMatchers.anyMap()))
                .thenReturn(java.util.Map.of("secure_url", "https://res.cloudinary.com/test/image/upload/naherb/avatars/avatar_test.png"));

        byte[] pngBytes = java.util.Base64.getDecoder()
                .decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==");

        mockMvc.perform(multipart("/api/account/profile/avatar")
                        .file(new org.springframework.mock.web.MockMultipartFile(
                                "file", "avatar.png", "image/png", pngBytes))
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.avatarUrl", is("https://res.cloudinary.com/test/image/upload/naherb/avatars/avatar_test.png")));
    }

    @Test
    void updateProfileValidatesRequiredFullName() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie);
        SessionCookies session = login(csrfCookie);

        mockMvc.perform(put("/api/account/profile")
                        .cookie(session.access(), session.refresh(), csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": ""
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    private void register(Cookie csrfCookie) throws Exception {
        register(csrfCookie, "user@naherb.vn", "NaHerb User", null);
    }

    private void register(Cookie csrfCookie, String email, String name, String phone) throws Exception {
        String otp = otpService.generateAndStoreOtp(email, "{}");
        String phoneField = phone == null ? "null" : "\"" + phone + "\"";

        mockMvc.perform(post("/api/auth/register")
                        .cookie(csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "password123",
                                  "name": "%s",
                                  "phone": %s,
                                  "otp": "%s"
                                }
                                """.formatted(email, name, phoneField, otp)))
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
                .andExpect(status().isOk())
                .andReturn();
        return result.getResponse().getCookie("XSRF-TOKEN");
    }

    private record SessionCookies(Cookie access, Cookie refresh) {}
}
