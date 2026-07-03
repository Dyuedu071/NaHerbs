package vn.io.naherb.product.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;
import vn.io.naherb.common.enums.StockStatus;

@Data
@Builder
public class ProductSkuResponse {
    private UUID id;
    private String skuCode;
    private String name;
    private String color;
    private String scent;
    private String type;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private StockStatus stockStatus;
    private String thumbnailUrl;
    private vn.io.naherb.common.enums.SkuStatus status;
}
