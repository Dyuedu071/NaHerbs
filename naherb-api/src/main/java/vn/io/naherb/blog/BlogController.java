package vn.io.naherb.blog;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.io.naherb.blog.dto.BlogPostRequest;

import java.util.List;

import vn.io.naherb.blog.dto.BlogCategoryDto;

@RestController
@RequestMapping("/api/v1/admin/blog")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping
    public ResponseEntity<vn.io.naherb.blog.dto.BlogPostResponse> createPost(@Valid @RequestBody BlogPostRequest request) {
        vn.io.naherb.blog.dto.BlogPostResponse post = blogService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<vn.io.naherb.blog.dto.BlogPostResponse>> listAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) java.util.UUID categoryId) {
        
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(
            page, size, org.springframework.data.domain.Sort.by("createdAt").descending()
        );
        org.springframework.data.domain.Page<vn.io.naherb.blog.dto.BlogPostResponse> posts = blogService.listAllPosts(pageable, search, categoryId);
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable java.util.UUID id) {
        blogService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<vn.io.naherb.blog.dto.BlogPostResponse> getPostById(@PathVariable java.util.UUID id) {
        return ResponseEntity.ok(blogService.getPostById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<vn.io.naherb.blog.dto.BlogPostResponse> updatePost(@PathVariable java.util.UUID id, @Valid @RequestBody BlogPostRequest request) {
        vn.io.naherb.blog.dto.BlogPostResponse post = blogService.updatePost(id, request);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<BlogCategoryDto>> getCategories() {
        return ResponseEntity.ok(blogService.getAllCategories());
    }
}
