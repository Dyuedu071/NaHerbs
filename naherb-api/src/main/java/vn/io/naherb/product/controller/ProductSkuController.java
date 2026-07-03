package vn.io.naherb.product.controller;
import vn.io.naherb.product.service.ProductService;
import vn.io.naherb.product.entity.*;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import vn.io.naherb.common.response.ApiResponse;
import vn.io.naherb.product.dto.ProductSkuDetailDto;
import vn.io.naherb.product.dto.UpdateStockRequest;
import vn.io.naherb.product.dto.UpsertProductSkuRequest;

@RestController
@RequestMapping({"/api/admin/product-skus", "/api/v1/admin/product-skus"})
public class ProductSkuController {

    private final ProductService productService;

    public ProductSkuController(ProductService productService) {
        this.productService = productService;
    }

    @PutMapping("/{skuId}")
    public ApiResponse<ProductSkuDetailDto> updateSku(
            @PathVariable UUID skuId,
            @Valid @RequestBody UpsertProductSkuRequest request) {
        return ApiResponse.ok(productService.updateSku(skuId, request));
    }

    @PatchMapping("/{skuId}/stock")
    public ApiResponse<Object> updateSkuStock(
            @PathVariable UUID skuId,
            @Valid @RequestBody UpdateStockRequest request) {
        productService.updateSkuStock(skuId, request);
        return ApiResponse.ok(null);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{skuId}")
    public ApiResponse<Object> deleteSku(@PathVariable UUID skuId) {
        productService.deleteSku(skuId);
        return ApiResponse.ok(null);
    }
}
