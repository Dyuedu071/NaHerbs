package vn.io.naherb.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.io.naherb.blog.dto.BlogPostResponse;

@RestController
@RequestMapping({"/api/blogs", "/api/blog-posts", "/api/v1/blogs", "/api/v1/blog-posts"})
public class PublicBlogController {

    private final BlogService blogService;

    public PublicBlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<Page<BlogPostResponse>> listBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String categorySlug) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending().and(Sort.by("createdAt").descending()));
        Page<BlogPostResponse> posts = blogService.listPosts(pageable, categorySlug);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPostResponse> getBlogBySlug(@PathVariable String slug) {
        BlogPostResponse post = blogService.getPostBySlug(slug);
        return ResponseEntity.ok(post);
    }
}
