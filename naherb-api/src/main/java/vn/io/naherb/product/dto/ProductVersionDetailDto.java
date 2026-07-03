package vn.io.naherb.product.dto;

import lombok.Data;
import vn.io.naherb.common.enums.ContentStatus;

import java.util.List;
import java.util.UUID;

@Data
public class ProductVersionDetailDto {
    private UUID id;
    private String name;
    private String code;
    private String description;
    private Integer displayOrder;
    private ContentStatus status;
    private List<ProductSkuDetailDto> skus;
}
