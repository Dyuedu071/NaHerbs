package vn.io.naherb.product.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;

@Data
public class UpsertProductImageRequest {
    private UUID mediaId;
    private String url;
    private String altText;
    @JsonProperty("isThumbnail")
    private boolean isThumbnail;
    private Integer displayOrder;
}
