package vn.io.naherb.product.dto;

import java.util.List;
import java.util.UUID;

public record PublicProductDetailResponse(
        UUID id,
        String name,
        String slug,
        PublicProductCategoryResponse category,
        String shortDescription,
        String detailDescription,
        String usageInstruction,
        String safetyNote,
        String seoTitle,
        String seoDescription,
        List<PublicProductVersionResponse> versions,
        List<PublicProductImageResponse> images,
        List<PublicProductSummaryResponse> relatedProducts) {}
