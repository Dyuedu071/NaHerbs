package vn.io.naherb.product.dto;

import java.util.List;
import java.util.UUID;

public record PublicProductVersionResponse(
        UUID id,
        String name,
        Integer displayOrder,
        List<PublicProductSkuResponse> skus) {}
