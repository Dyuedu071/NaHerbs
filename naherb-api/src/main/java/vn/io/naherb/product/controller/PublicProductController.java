package vn.io.naherb.product.controller;
import vn.io.naherb.product.service.ProductService;
import vn.io.naherb.product.entity.*;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.response.PageResponse;
import vn.io.naherb.product.dto.ProductCategoryResponse;
import vn.io.naherb.product.dto.ProductDetailResponse;
import vn.io.naherb.product.dto.ProductListResponse;
import vn.io.naherb.product.service.PublicProductService;

@RestController
@RequestMapping({"/api", "/api/v1"})
@RequiredArgsConstructor
public class PublicProductController {

    private final PublicProductService publicProductService;

    @GetMapping("/product-categories")
    public ResponseEntity<List<ProductCategoryResponse>> getCategories(
            @RequestParam(required = false) String status) {
        ContentStatus contentStatus = null;
        if (status != null && !status.isBlank()) {
            contentStatus = ContentStatus.valueOf(status.toUpperCase());
        }
        return ResponseEntity.ok(publicProductService.getCategories(contentStatus));
    }

    @GetMapping("/products")
    public ResponseEntity<PageResponse<ProductListResponse>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) String need,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(publicProductService.searchProducts(
                keyword, categorySlug, need, inStockOnly, sort, page, size));
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<ProductDetailResponse> getProductDetail(
            @PathVariable String slug) {
        return ResponseEntity.ok(publicProductService.getProductDetail(slug));
    }
}
