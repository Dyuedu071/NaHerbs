package vn.io.naherb.product.dto;

import java.util.UUID;

public record PublicProductImageResponse(
        UUID id,
        String url,
        String altText,
        boolean isThumbnail) {}
