package vn.io.naherb.health;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.blog.BlogPostRepository;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.product.repository.ProductCategoryRepository;
import vn.io.naherb.product.repository.ProductRepository;

/**
 * Public SEO endpoint – provides data for Next.js sitemap.ts
 * GET /api/v1/seo/sitemap-data
 */
@RestController
@RequestMapping("/api/v1/seo")
@RequiredArgsConstructor
public class SeoController {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final BlogPostRepository blogPostRepository;

    @GetMapping("/sitemap-data")
    public ResponseEntity<Map<String, Object>> getSitemapData() {

        List<Map<String, Object>> products = productRepository
                .findByStatusOrderByDisplayOrderAsc(ContentStatus.PUBLISHED)
                .stream()
                .map(p -> buildItem(p.getSlug(), p.getUpdatedAt()))
                .toList();

        List<Map<String, Object>> categories = categoryRepository
                .findByStatusOrderByDisplayOrderAsc(ContentStatus.PUBLISHED)
                .stream()
                .map(c -> buildItem(c.getSlug(), c.getUpdatedAt()))
                .toList();

        List<Map<String, Object>> blogPosts = blogPostRepository
                .findAll()
                .stream()
                .filter(b -> b.getStatus() == ContentStatus.PUBLISHED)
                .limit(500)
                .map(b -> buildItem(b.getSlug(), b.getUpdatedAt()))
                .toList();

        Map<String, Object> data = Map.of(
                "staticPages", List.of(
                        "/",
                        "/san-pham",
                        "/tin-tuc",
                        "/gioi-thieu",
                        "/lien-he"),
                "products", products,
                "categories", categories,
                "blogPosts", blogPosts);

        return ResponseEntity.ok(Map.of("data", data));
    }

    private static Map<String, Object> buildItem(String slug, Instant updatedAt) {
        return Map.of(
                "slug", slug != null ? slug : "",
                "updatedAt", updatedAt != null ? updatedAt.toString() : "");
    }
}
