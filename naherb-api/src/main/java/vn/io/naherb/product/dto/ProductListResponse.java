package vn.io.naherb.product.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;
import vn.io.naherb.common.enums.StockStatus;

@Data
@Builder
public class ProductListResponse {
    private UUID id;
    private String name;
    private String slug;
    private String thumbnailUrl;
    private String shortDescription;
    private BigDecimal minSalePrice;
    private BigDecimal maxSalePrice;
    private StockStatus stockStatus;
}
