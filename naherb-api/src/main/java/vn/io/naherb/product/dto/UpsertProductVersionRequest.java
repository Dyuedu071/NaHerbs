package vn.io.naherb.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import vn.io.naherb.common.enums.ContentStatus;

@Data
public class UpsertProductVersionRequest {

    @NotBlank(message = "Version name is required")
    private String name;

    private String code;

    private String description;

    private Integer displayOrder = 0;

    private ContentStatus status = ContentStatus.PUBLISHED;

    private java.util.List<UpsertProductSkuRequest> skus;
}
