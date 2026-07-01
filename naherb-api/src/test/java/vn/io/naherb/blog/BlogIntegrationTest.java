package vn.io.naherb.blog;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import vn.io.naherb.blog.dto.BlogPostRequest;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.product.Product;
import vn.io.naherb.product.repository.ProductRepository;

import java.util.List;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import vn.io.naherb.auth.service.EmailService;

import org.springframework.context.annotation.Import;
import vn.io.naherb.InMemoryTokenStoreTestConfig;
import org.springframework.test.context.TestPropertySource;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Import(InMemoryTokenStoreTestConfig.class)
@TestPropertySource(properties = {
    "app.security.google.client-id=test-client-id"
})
class BlogIntegrationTest {

    @MockBean
    private JavaMailSender javaMailSender;

    @MockBean
    private EmailService emailService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setup() {
        blogPostRepository.deleteAll();
        productRepository.deleteAll();
    }

    @Test
    void testCreateBlogWithValidData() throws Exception {
        // Arrange
        Product product = vn.io.naherb.product.ProductTestFactory.createProduct("Test Product", "test-product");
        Product savedProduct = productRepository.save(product);

        BlogPostRequest request = new BlogPostRequest();
        request.setTitle("Integration Test Blog");
        request.setSlug("integration-test-blog");
        request.setContent("<p>Test Content</p>");
        request.setStatus(ContentStatus.DRAFT);
        request.setProductIds(List.of(savedProduct.getId()));

        // Act & Assert
        mockMvc.perform(post("/api/v1/admin/blog")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Integration Test Blog")))
                .andExpect(jsonPath("$.slug", is("integration-test-blog")));
    }
}
