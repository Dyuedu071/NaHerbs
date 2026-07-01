package vn.io.naherb.product;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import vn.io.naherb.common.response.ApiResponse;
import vn.io.naherb.common.response.PageResponse;
import vn.io.naherb.product.dto.ProductSummaryDto;

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
}
