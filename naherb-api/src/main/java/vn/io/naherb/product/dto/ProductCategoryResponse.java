package vn.io.naherb.product.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductCategoryResponse {
    private UUID id;
    private String name;
    private String slug;
}
