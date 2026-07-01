package vn.io.naherb.blog;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import vn.io.naherb.blog.dto.BlogPostRequest;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.exception.ConflictException;
import vn.io.naherb.exception.GlobalExceptionHandler;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BlogController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for unit test
@Import(GlobalExceptionHandler.class)
@org.springframework.boot.context.properties.EnableConfigurationProperties(vn.io.naherb.config.UploadProperties.class)
public class BlogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BlogService blogService;

    @MockBean
    private vn.io.naherb.security.AuthCookieService authCookieService;

    @Autowired
    private ObjectMapper objectMapper;

    // TC-002: Validation Error on missing title
    @Test
    void createPost_WithoutTitle_ShouldReturn400() throws Exception {
        BlogPostRequest request = new BlogPostRequest();
        request.setContent("<p>Hello</p>");
        
        mockMvc.perform(post("/api/v1/admin/blog")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // TC-005: Validation Error on SEO fields too long
    @Test
    void createPost_SeoFieldsTooLong_ShouldReturn400() throws Exception {
        BlogPostRequest request = new BlogPostRequest();
        request.setTitle("Valid Title");
        request.setContent("<p>Content</p>");
        request.setSeoTitle("A".repeat(61)); // Exceeds 60
        
        mockMvc.perform(post("/api/v1/admin/blog")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // TC-007: Duplicate Slug Error handling (Service throws exception)
    @Test
    void createPost_DuplicateSlug_ShouldReturn400Or409() throws Exception {
        BlogPostRequest request = new BlogPostRequest();
        request.setTitle("Valid Title");
        request.setContent("<p>Content</p>");
        request.setSlug("duplicate-slug");

        when(blogService.createPost(any(BlogPostRequest.class)))
                .thenThrow(new ConflictException("Slug already exists"));

        mockMvc.perform(post("/api/v1/admin/blog")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict()); 
    }
}

