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
    public ResponseEntity<BlogPost> createPost(@Valid @RequestBody BlogPostRequest request) {
        BlogPost post = blogService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<BlogCategoryDto>> getCategories() {
        return ResponseEntity.ok(blogService.getAllCategories());
    }
}
