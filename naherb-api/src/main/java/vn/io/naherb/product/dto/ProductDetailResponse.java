package vn.io.naherb.product.dto;

import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDetailResponse {
    private UUID id;
    private String name;
    private String slug;
    private ProductCategoryResponse category;
    private String shortDescription;
    private String detailDescription;
    private String usageInstruction;
    private String safetyNote;
    private String seoTitle;
    private String seoDescription;
    
    private List<ProductVersionResponse> versions;
    private List<ProductImageResponse> images;
    private List<ProductListResponse> relatedProducts;
}
