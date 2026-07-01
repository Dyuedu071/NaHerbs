package vn.io.naherb.product.dto;

import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductVersionResponse {
    private UUID id;
    private String name;
    private List<ProductSkuResponse> skus;
}
