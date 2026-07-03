package vn.io.naherb.blog;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.io.naherb.blog.dto.BlogPostRequest;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.product.repository.ProductRepository;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BlogServiceTest {

    @Mock
    private BlogPostRepository blogPostRepository;

    @Mock
    private BlogCategoryRepository categoryRepository;

    @Mock
    private BlogPostProductRepository postProductRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private BlogService blogService;

    private BlogPostRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new BlogPostRequest();
        validRequest.setTitle("Bài viết Test");
        validRequest.setContent("<p>Nội dung</p>");
        validRequest.setStatus(ContentStatus.DRAFT);
    }

    // TC-003: Save post without slug should auto-generate slug
    @Test
    void createPost_WithoutSlug_ShouldAutoGenerateSlug() {
        // Arrange
        validRequest.setSlug(null);
        when(blogPostRepository.existsBySlug("bai-viet-test")).thenReturn(false);
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> {
            BlogPost post = invocation.getArgument(0);
            return post;
        });

        // Act
        vn.io.naherb.blog.dto.BlogPostResponse result = blogService.createPost(validRequest);

        // Assert
        assertNotNull(result);
        assertEquals("bai-viet-test", result.getSlug());
        verify(blogPostRepository).save(any(BlogPost.class));
    }

    // Auto-generate slug with suffix if duplicate
    @Test
    void createPost_WithoutSlug_DuplicateExists_ShouldAppendSuffix() {
        // Arrange
        validRequest.setSlug(null);
        when(blogPostRepository.existsBySlug("bai-viet-test")).thenReturn(true);
        when(blogPostRepository.existsBySlug("bai-viet-test-2")).thenReturn(false);
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> {
            BlogPost post = invocation.getArgument(0);
            return post;
        });

        // Act
        vn.io.naherb.blog.dto.BlogPostResponse result = blogService.createPost(validRequest);

        // Assert
        assertEquals("bai-viet-test-2", result.getSlug());
    }

    // TC-006: Exceed 6 products should throw Exception
    @Test
    void createPost_WithMoreThan6Products_ShouldThrowException() {
        // Arrange
        validRequest.setProductIds(List.of(
            UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), 
            UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID()
        ));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            blogService.createPost(validRequest);
        });

        assertEquals("A blog post can have a maximum of 6 associated products.", exception.getMessage());
        verify(blogPostRepository, never()).save(any());
    }
}
