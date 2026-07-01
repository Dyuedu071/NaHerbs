package vn.io.naherb.product.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.enums.StockStatus;

@Data
public class ProductSummaryDto {
    private UUID id;
    private String name;
    private String slug;
    private String skuCode;
    private String categoryName;
    private String categorySlug;
    private Integer skuCount;
    private BigDecimal minSalePrice;
    private BigDecimal maxSalePrice;
    private Integer totalStockQuantity;
    private StockStatus stockStatus;
    private ContentStatus status;
    private String thumbnailUrl;
}
