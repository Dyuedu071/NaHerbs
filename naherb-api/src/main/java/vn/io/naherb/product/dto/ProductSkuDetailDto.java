package vn.io.naherb.product.dto;

import lombok.Data;
import vn.io.naherb.common.enums.SkuStatus;
import vn.io.naherb.common.enums.StockStatus;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductSkuDetailDto {
    private UUID id;
    private UUID versionId;
    private String skuCode;
    private String skuName;
    private String color;
    private String scent;
    private String type;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private StockStatus stockStatus;
    private SkuStatus status;
    private Integer displayOrder;
}
