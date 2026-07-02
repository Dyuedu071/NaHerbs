package vn.io.naherb.product;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.common.response.ApiResponse;
import vn.io.naherb.product.dto.PublicProductDetailResponse;
import vn.io.naherb.product.dto.PublicProductPageResponse;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PublicProductPageResponse>> listPublishedProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "12") Integer size) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getPublishedProducts(
                keyword, categorySlug, inStockOnly, sort, page, size)));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PublicProductDetailResponse>> getPublishedProductDetail(
            @PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getPublishedProductDetail(slug)));
    }
}
