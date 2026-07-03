package vn.io.naherb.product.controller;
import vn.io.naherb.product.service.ProductService;
import vn.io.naherb.product.entity.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;

import java.util.UUID;

import java.util.List;

import vn.io.naherb.common.response.ApiResponse;
import vn.io.naherb.common.response.PageResponse;
import vn.io.naherb.product.dto.ProductSkuDetailDto;
import vn.io.naherb.product.dto.ProductSummaryDto;
import vn.io.naherb.product.dto.ProductDetailResponse;
import vn.io.naherb.product.dto.ProductVersionDetailDto;
import vn.io.naherb.product.dto.UpsertProductRequest;
import vn.io.naherb.product.dto.UpsertProductSkuRequest;
import vn.io.naherb.product.dto.UpsertProductVersionRequest;

@RestController
@RequestMapping({"/api/admin/products", "/api/v1/admin/products"})
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ApiResponse<PageResponse<ProductSummaryDto>> getProducts() {
        List<ProductSummaryDto> list = productService.getAllProducts();
        PageResponse<ProductSummaryDto> page = PageResponse.<ProductSummaryDto>builder()
                .items(list)
                .page(0)
                .size(list.size())
                .totalItems(list.size())
                .totalPages(1)
                .build();
        return ApiResponse.ok(page);
    }

    @GetMapping("/{productId}")
    public ApiResponse<ProductDetailResponse> getProductDetail(@PathVariable UUID productId) {
        return ApiResponse.ok(productService.getProductDetailById(productId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Object> createProduct(@Valid @RequestBody UpsertProductRequest request) {
        productService.createProduct(request);
        return ApiResponse.ok(null);
    }

    @PutMapping("/{productId}")
    public ApiResponse<Object> updateProduct(@PathVariable UUID productId, @Valid @RequestBody UpsertProductRequest request) {
        productService.updateProduct(productId, request);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{productId}")
    public ApiResponse<Object> archiveProduct(@PathVariable UUID productId) {
        productService.archiveProduct(productId);
        return ApiResponse.ok(null);
    }

    // ─── Version endpoints ────────────────────────────────────────

    @GetMapping("/{productId}/versions")
    public ApiResponse<List<ProductVersionDetailDto>> getVersionsByProduct(@PathVariable UUID productId) {
        return ApiResponse.ok(productService.getVersionsByProduct(productId));
    }

    @PostMapping("/{productId}/versions")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ProductVersionDetailDto> createVersion(
            @PathVariable UUID productId,
            @Valid @RequestBody UpsertProductVersionRequest request) {
        return ApiResponse.ok(productService.createVersion(productId, request));
    }

    @DeleteMapping("/{productId}/versions/{versionId}")
    public ApiResponse<Object> deleteVersion(
            @PathVariable UUID productId,
            @PathVariable UUID versionId) {
        productService.deleteVersion(versionId);
        return ApiResponse.ok(null);
    }

    @PutMapping("/{productId}/versions/{versionId}")
    public ApiResponse<ProductVersionDetailDto> updateVersion(
            @PathVariable UUID productId,
            @PathVariable UUID versionId,
            @Valid @RequestBody UpsertProductVersionRequest request) {
        return ApiResponse.ok(productService.updateVersion(versionId, request));
    }

    // ─── SKU endpoints ────────────────────────────────────────────

    @GetMapping("/{productId}/skus")
    public ApiResponse<List<ProductSkuDetailDto>> getSkusByProduct(@PathVariable UUID productId) {
        return ApiResponse.ok(productService.getSkusByProduct(productId));
    }

    @PostMapping("/{productId}/skus")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ProductSkuDetailDto> createSku(
            @PathVariable UUID productId,
            @Valid @RequestBody UpsertProductSkuRequest request) {
        return ApiResponse.ok(productService.createSku(productId, request));
    }
}
