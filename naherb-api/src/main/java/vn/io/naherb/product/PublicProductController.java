package vn.io.naherb.product;

import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.response.ApiResponse;
import vn.io.naherb.product.dto.PublicProductCategoryResponse;
import vn.io.naherb.product.dto.PublicProductDetailResponse;
import vn.io.naherb.product.dto.PublicProductPageResponse;
import vn.io.naherb.product.repository.ProductCategoryRepository;

@RestController
@RequestMapping({"/api", "/api/v1"})
@RequiredArgsConstructor
public class PublicProductController {

    private final ProductService productService;
    private final ProductCategoryRepository productCategoryRepository;

    @GetMapping("/product-categories")
    public ResponseEntity<ApiResponse<List<PublicProductCategoryResponse>>> listPublishedProductCategories() {
        List<PublicProductCategoryResponse> categories = productCategoryRepository
                .findByStatusOrderByDisplayOrderAsc(ContentStatus.PUBLISHED)
                .stream()
                .map(category -> new PublicProductCategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getSlug()))
                .toList();

        return ResponseEntity.ok(ApiResponse.ok(categories));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<PublicProductPageResponse>> listPublishedProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<String> categorySlugs,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "12") Integer size) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getPublishedProducts(
                keyword, categorySlugs, minPrice, maxPrice, inStockOnly, sort, page, size)));
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<ApiResponse<PublicProductDetailResponse>> getPublishedProductDetail(
            @PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getPublishedProductDetail(slug)));
    }
}
