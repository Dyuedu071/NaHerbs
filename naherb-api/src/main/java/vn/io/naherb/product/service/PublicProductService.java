package vn.io.naherb.product.service;

import java.util.List;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.response.PageResponse;
import vn.io.naherb.product.dto.ProductCategoryResponse;
import vn.io.naherb.product.dto.ProductDetailResponse;
import vn.io.naherb.product.dto.ProductListResponse;

public interface PublicProductService {
    
    List<ProductCategoryResponse> getCategories(ContentStatus status);
    
    PageResponse<ProductListResponse> searchProducts(
            String keyword, 
            String categorySlug, 
            String need, 
            Boolean inStockOnly, 
            String sort, 
            int page, 
            int size);
            
    ProductDetailResponse getProductDetail(String slug);
}
