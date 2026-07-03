package vn.io.naherb.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.io.naherb.common.enums.ContentStatus;

import java.util.List;
import java.util.UUID;

@Data
public class UpsertProductRequest {
    
    private UUID categoryId;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Product slug is required")
    private String slug;

    private String shortDescription;

    private String detailDescription;

    private String usageInstruction;

    private String safetyNote;
    
    private String seoTitle;
    
    private String seoDescription;

    @NotNull(message = "Product status is required")
    private ContentStatus status;

    private String benefits;

    private String preservationInstruction;

    private String primaryKeyword;

    private boolean isFeatured;

    private Integer displayOrder;

    private List<UpsertProductImageRequest> images;

    // Fast track SKU creation fields (optional)
    private Boolean createDefaultSku;
    
    private java.math.BigDecimal originalPrice;
    
    private java.math.BigDecimal salePrice;
    
    private Integer stockQuantity;
    
    private String skuCode;

    // Nested creation flow
    private java.util.List<UpsertProductVersionRequest> versions;
}
