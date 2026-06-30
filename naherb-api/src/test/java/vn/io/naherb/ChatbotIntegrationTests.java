package vn.io.naherb;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import java.nio.file.Path;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountAddressRepository;
import vn.io.naherb.account.AccountProfileRepository;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.account.Role;
import vn.io.naherb.auth.service.OtpService;
import vn.io.naherb.cart.CartRepository;
import vn.io.naherb.chatbot.ChatbotConfigService;
import vn.io.naherb.chatbot.repository.ChatbotConfigRepository;
import vn.io.naherb.chatbot.repository.ChatbotConversationRepository;
import vn.io.naherb.chatbot.repository.ChatbotMessageRepository;
import vn.io.naherb.chatbot.rag.KnowledgeChunkRepository;
import vn.io.naherb.chatbot.rag.KnowledgeDocumentRepository;
import vn.io.naherb.chatbot.rag.KnowledgeIngestService;

@SpringBootTest
@AutoConfigureMockMvc
@Import({InMemoryTokenStoreTestConfig.class, MockOpenAiTestConfig.class})
class ChatbotIntegrationTests {

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
    private ChatbotConversationRepository conversationRepository;

    @Autowired
    private ChatbotMessageRepository messageRepository;

    @Autowired
    private ChatbotConfigRepository chatbotConfigRepository;

    @Autowired
    private KnowledgeDocumentRepository knowledgeDocumentRepository;

    @Autowired
    private KnowledgeChunkRepository knowledgeChunkRepository;

    @Autowired
    private KnowledgeIngestService knowledgeIngestService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ChatbotConfigService chatbotConfigService;

    @BeforeEach
    void setUp() throws Exception {
        messageRepository.deleteAll();
        conversationRepository.deleteAll();
        knowledgeChunkRepository.deleteAll();
        knowledgeDocumentRepository.deleteAll();
        cartRepository.deleteAll();
        accountAddressRepository.deleteAll();
        accountProfileRepository.deleteAll();
        accountRepository.deleteAll();
        chatbotConfigRepository.deleteAll();
        chatbotConfigService.ensureDefaults();

        knowledgeIngestService.ingestMarkdownFile(
                Path.of("src/test/resources/chatbot-knowledge/sample.md"));
    }

    @Test
    void getPublicConfigWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/chatbot/config/public"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.enabled", is(true)))
                .andExpect(jsonPath("$.data.welcomeMessage", notNullValue()))
                .andExpect(jsonPath("$.data.disclaimer", notNullValue()));
    }

    @Test
    void createConversationWithoutAuth() throws Exception {
        mockMvc.perform(post("/api/chatbot/conversations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "sessionId": "browser-session-1",
                                  "sourcePage": "/"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id", notNullValue()))
                .andExpect(jsonPath("$.data.sessionId", is("browser-session-1")))
                .andExpect(jsonPath("$.data.status", is("OPEN")));
    }

    @Test
    void sendMessageUsesRagContext() throws Exception {
        MvcResult conversation = mockMvc.perform(post("/api/chatbot/conversations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"sessionId":"session-rag"}
                                """))
                .andExpect(status().isCreated())
                .andReturn();

        String conversationId = readJsonPath(conversation, "$.data.id");

        mockMvc.perform(post("/api/chatbot/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "conversationId": "%s",
                                  "sessionId": "session-rag",
                                  "message": "Tôi mỏi cổ vai gáy, dùng gối nào?",
                                  "sourcePage": "/"
                                }
                                """.formatted(conversationId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.answer", containsString("Gối")))
                .andExpect(jsonPath("$.data.disclaimer", notNullValue()))
                .andExpect(jsonPath("$.data.recommendedProducts", notNullValue()));
    }

    @Test
    void loggedInUserCanSendMessage() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie);
        SessionCookies session = login(csrfCookie, "user@naherb.vn");

        MvcResult conversation = mockMvc.perform(post("/api/chatbot/conversations")
                        .cookie(csrfCookie, session.access(), session.refresh())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"sessionId":"session-user"}
                                """))
                .andExpect(status().isCreated())
                .andReturn();

        String conversationId = readJsonPath(conversation, "$.data.id");

        mockMvc.perform(post("/api/chatbot/messages")
                        .cookie(csrfCookie, session.access(), session.refresh())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "conversationId": "%s",
                                  "sessionId": "session-user",
                                  "message": "Gối thảo dược dùng thế nào?",
                                  "sourcePage": "/"
                                }
                                """.formatted(conversationId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.answer", notNullValue()))
                .andExpect(jsonPath("$.data.disclaimer", notNullValue()));
    }

    @Test
    void sendMessageIgnoresInvalidAccessTokenCookie() throws Exception {
        MvcResult conversation = mockMvc.perform(post("/api/chatbot/conversations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"sessionId":"session-guest"}
                                """))
                .andExpect(status().isCreated())
                .andReturn();

        String conversationId = readJsonPath(conversation, "$.data.id");

        mockMvc.perform(post("/api/chatbot/messages")
                        .cookie(new Cookie("NAHERB_ACCESS_TOKEN", "invalid.jwt.token"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "conversationId": "%s",
                                  "sessionId": "session-guest",
                                  "message": "Xin chào",
                                  "sourcePage": "/"
                                }
                                """.formatted(conversationId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.answer", notNullValue()));
    }

    @Test
    void adminCanGetAndUpdateConfig() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        createAdminAndLogin(csrfCookie);

        mockMvc.perform(get("/api/admin/chatbot/config")
                        .cookie(csrfCookie, adminSession.access(), adminSession.refresh()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.fallbackMessage", notNullValue()));

        mockMvc.perform(put("/api/admin/chatbot/config")
                        .cookie(csrfCookie, adminSession.access(), adminSession.refresh())
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "welcomeMessage": "Chào bạn đến với NaHerbs!",
                                  "enabled": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.welcomeMessage", is("Chào bạn đến với NaHerbs!")));
    }

    @Test
    void adminCanUploadAndListKnowledge() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        createAdminAndLogin(csrfCookie);

        MvcResult uploadResult = mockMvc.perform(multipart("/api/admin/chatbot/knowledge")
                        .file(new org.springframework.mock.web.MockMultipartFile(
                                "file",
                                "admin-upload.md",
                                "text/markdown",
                                """
                                # Gối thảo dược

                                Nội dung upload từ admin.
                                """
                                        .getBytes(java.nio.charset.StandardCharsets.UTF_8)))
                        .param("replace", "true")
                        .cookie(csrfCookie, adminSession.access(), adminSession.refresh())
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.ingestStarted", is(true)))
                .andReturn();

        String sourcePath = readJsonPath(uploadResult, "$.data.document.sourcePath");
        Cookie freshCsrf = fetchCsrfCookie();

        mockMvc.perform(delete("/api/admin/chatbot/knowledge")
                        .param("sourcePath", sourcePath)
                        .cookie(freshCsrf, adminSession.access(), adminSession.refresh())
                        .header("X-XSRF-TOKEN", freshCsrf.getValue()))
                .andExpect(status().isOk());
    }

    @Test
    void regularUserCannotAccessAdminConfig() throws Exception {
        Cookie csrfCookie = fetchCsrfCookie();
        register(csrfCookie);
        SessionCookies session = login(csrfCookie, "user@naherb.vn");

        mockMvc.perform(get("/api/admin/chatbot/config")
                        .cookie(csrfCookie, session.access(), session.refresh()))
                .andExpect(status().isForbidden());
    }

    private SessionCookies adminSession;

    private void createAdminAndLogin(Cookie csrfCookie) throws Exception {
        Account admin = new Account("admin@naherb.vn", passwordEncoder.encode("password123"), "Admin");
        admin.setRole(Role.ADMIN);
        accountRepository.save(admin);

        MvcResult login = mockMvc.perform(post("/api/auth/login")
                        .cookie(csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "admin@naherb.vn",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn();

        adminSession = new SessionCookies(
                login.getResponse().getCookie(ACCESS_COOKIE),
                login.getResponse().getCookie(REFRESH_COOKIE));
    }

    private String readJsonPath(MvcResult result, String path) throws Exception {
        return com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), path);
    }

    private void register(Cookie csrfCookie) throws Exception {
        String otp = otpService.generateAndStoreOtp("user@naherb.vn", "{}");
        mockMvc.perform(post("/api/auth/register")
                        .cookie(csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "user@naherb.vn",
                                  "password": "password123",
                                  "name": "User",
                                  "otp": "%s"
                                }
                                """.formatted(otp)))
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

    private record SessionCookies(Cookie access, Cookie refresh) {}
}
