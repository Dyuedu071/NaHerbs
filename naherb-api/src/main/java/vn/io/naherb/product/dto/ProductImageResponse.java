package vn.io.naherb.product.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductImageResponse {
    private UUID id;
    private String url;
    private String altText;
    private boolean isThumbnail;
    private Integer displayOrder;
}
