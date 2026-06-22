package vn.io.naherb;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
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
import vn.io.naherb.account.AccountRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Import(InMemoryTokenStoreTestConfig.class)
class AuthFlowIntegrationTests {

    private static final String ACCESS_COOKIE = "NAHERB_ACCESS_TOKEN";
    private static final String REFRESH_COOKIE = "NAHERB_REFRESH_TOKEN";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AccountRepository accountRepository;

    @BeforeEach
    void cleanDatabase() {
        accountRepository.deleteAll();
    }

    @Test
    void refreshRotatesTokensAndLogoutRevokesSession() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie);

        MvcResult login = mockMvc.perform(post("/api/auth/login")
                        .cookie(csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "user@naherb.vn",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(cookie().httpOnly(ACCESS_COOKIE, true))
                .andExpect(cookie().httpOnly(REFRESH_COOKIE, true))
                .andExpect(cookie().path(REFRESH_COOKIE, "/api/auth"))
                .andExpect(jsonPath("$.name", is("NaHerb User")))
                .andExpect(jsonPath("$.role", is("USER")))
                .andExpect(jsonPath("$.token").doesNotExist())
                .andReturn();

        Cookie firstAccess = login.getResponse().getCookie(ACCESS_COOKIE);
        Cookie firstRefresh = login.getResponse().getCookie(REFRESH_COOKIE);

        MvcResult refresh = mockMvc.perform(post("/api/auth/refresh")
                        .cookie(firstAccess, firstRefresh, csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(cookie().exists(ACCESS_COOKIE))
                .andExpect(cookie().exists(REFRESH_COOKIE))
                .andExpect(jsonPath("$.email", is("user@naherb.vn")))
                .andReturn();

        Cookie currentAccess = refresh.getResponse().getCookie(ACCESS_COOKIE);
        Cookie currentRefresh = refresh.getResponse().getCookie(REFRESH_COOKIE);
        assertNotEquals(firstAccess.getValue(), currentAccess.getValue());
        assertNotEquals(firstRefresh.getValue(), currentRefresh.getValue());

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(firstAccess, firstRefresh, csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/auth/me").cookie(currentAccess))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        mockMvc.perform(post("/api/auth/logout").cookie(currentAccess, currentRefresh))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/auth/logout")
                        .cookie(currentAccess, currentRefresh, csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isNoContent())
                .andExpect(cookie().maxAge(ACCESS_COOKIE, 0))
                .andExpect(cookie().maxAge(REFRESH_COOKIE, 0));

        mockMvc.perform(get("/api/auth/me").cookie(currentAccess))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(currentAccess, currentRefresh, csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isUnauthorized());
    }

    private void register(Cookie csrfCookie) throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .cookie(csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "user@naherb.vn",
                                  "password": "password123",
                                  "name": "NaHerb User"
                                }
                                """))
                .andExpect(status().isCreated());
    }

    private Cookie fetchCsrfCookie() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/auth/csrf"))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("XSRF-TOKEN"))
                .andReturn();
        return result.getResponse().getCookie("XSRF-TOKEN");
    }
}
