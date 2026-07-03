package vn.io.naherb.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.io.naherb.common.enums.SkuStatus;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class UpsertProductSkuRequest {

    @NotNull(message = "Version ID is required")
    private UUID versionId;

    @NotBlank(message = "SKU code is required")
    private String skuCode;

    @NotBlank(message = "SKU name is required")
    private String name;

    private String color;

    private String scent;

    private String type;

    private BigDecimal originalPrice;

    @NotNull(message = "Sale price is required")
    private BigDecimal salePrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be >= 0")
    private Integer stockQuantity = 0;

    private SkuStatus status = SkuStatus.ACTIVE;
}
