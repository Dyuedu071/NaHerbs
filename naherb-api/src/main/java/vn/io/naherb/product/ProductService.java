package vn.io.naherb.product;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.enums.SkuStatus;
import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.product.dto.ProductSummaryDto;
import vn.io.naherb.product.dto.PublicProductCategoryResponse;
import vn.io.naherb.product.dto.PublicProductDetailResponse;
import vn.io.naherb.product.dto.PublicProductImageResponse;
import vn.io.naherb.product.dto.PublicProductPageResponse;
import vn.io.naherb.product.dto.PublicProductSkuResponse;
import vn.io.naherb.product.dto.PublicProductSummaryResponse;
import vn.io.naherb.product.dto.PublicProductVersionResponse;
import vn.io.naherb.product.repository.ProductImageRepository;
import vn.io.naherb.product.repository.ProductRepository;
import vn.io.naherb.product.repository.ProductSkuRepository;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductSkuRepository productSkuRepository;
    private final ProductImageRepository productImageRepository;

    public ProductService(
            ProductRepository productRepository,
            ProductSkuRepository productSkuRepository,
            ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.productSkuRepository = productSkuRepository;
        this.productImageRepository = productImageRepository;
    }

    public List<ProductSummaryDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<UUID> productIds = products.stream().map(Product::getId).toList();

        Map<UUID, List<ProductSku>> skusByProduct = productIds.isEmpty()
                ? Map.of()
                : productSkuRepository.findByProductIdIn(productIds).stream()
                        .filter(sku -> sku.getProduct() != null)
                        .collect(Collectors.groupingBy(sku -> sku.getProduct().getId()));

        Map<UUID, List<ProductImage>> imagesByProduct = productIds.isEmpty()
                ? Map.of()
                : productImageRepository.findByProductIdIn(productIds).stream()
                        .filter(image -> image.getProduct() != null)
                        .collect(Collectors.groupingBy(image -> image.getProduct().getId()));

        return products.stream()
                .map(product -> toAdminSummary(
                        product,
                        skusByProduct.getOrDefault(product.getId(), List.of()),
                        imagesByProduct.getOrDefault(product.getId(), List.of())))
                .toList();
    }

    public PublicProductPageResponse getPublishedProducts(
            String keyword,
            String categorySlug,
            Boolean inStockOnly,
            String sort,
            Integer page,
            Integer size) {
        int safePage = Math.max(0, page == null ? 0 : page);
        int safeSize = Math.min(48, Math.max(1, size == null ? 12 : size));

        List<Product> products = productRepository.findByStatusOrderByDisplayOrderAsc(ContentStatus.PUBLISHED);
        List<UUID> productIds = products.stream().map(Product::getId).toList();
        List<ProductSku> allSkus = productIds.isEmpty()
                ? List.of()
                : productSkuRepository.findByProductIdIn(productIds);
        List<ProductImage> allImages = productIds.isEmpty()
                ? List.of()
                : productImageRepository.findByProductIdIn(productIds);

        Map<UUID, List<ProductSku>> skusByProductId = allSkus.stream()
                .filter(sku -> sku.getProduct() != null)
                .collect(Collectors.groupingBy(sku -> sku.getProduct().getId()));
        Map<UUID, List<ProductImage>> imagesByProductId = allImages.stream()
                .filter(image -> image.getProduct() != null)
                .collect(Collectors.groupingBy(image -> image.getProduct().getId()));

        List<PublicProductSummaryResponse> summaries = products.stream()
                .filter(product -> matchesKeyword(product, keyword))
                .filter(product -> matchesCategory(product, categorySlug))
                .map(product -> toSummary(
                        product,
                        skusByProductId.getOrDefault(product.getId(), List.of()),
                        imagesByProductId.getOrDefault(product.getId(), List.of())))
                .filter(summary -> !Boolean.TRUE.equals(inStockOnly)
                        || summary.stockStatus() != StockStatus.OUT_OF_STOCK)
                .sorted(summaryComparator(sort))
                .toList();

        int from = Math.min(safePage * safeSize, summaries.size());
        int to = Math.min(from + safeSize, summaries.size());
        List<PublicProductSummaryResponse> pageItems = summaries.subList(from, to);
        int totalPages = summaries.isEmpty() ? 0 : (int) Math.ceil((double) summaries.size() / safeSize);

        return new PublicProductPageResponse(pageItems, safePage, safeSize, summaries.size(), totalPages);
    }

    public PublicProductDetailResponse getPublishedProductDetail(String slug) {
        Product product = productRepository.findBySlugAndStatus(slug, ContentStatus.PUBLISHED)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        List<ProductSku> skus = productSkuRepository.findByProductId(product.getId());
        List<ProductImage> images = productImageRepository.findByProductId(product.getId());

        return new PublicProductDetailResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                toCategory(product.getCategory()),
                product.getShortDescription(),
                product.getDetailDescription(),
                product.getUsageInstruction(),
                product.getSafetyNote(),
                product.getSeoTitle(),
                product.getSeoDescription(),
                toVersions(skus),
                images.stream().map(this::toImage).toList(),
                relatedProducts(product));
    }

    private ProductSummaryDto toAdminSummary(Product product, List<ProductSku> skus, List<ProductImage> images) {
        ProductSummaryDto dto = new ProductSummaryDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setStatus(product.getStatus());

        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
            dto.setCategorySlug(product.getCategory().getSlug());
        }

        dto.setSkuCount(skus.size());
        if (!skus.isEmpty()) {
            dto.setSkuCode(skus.get(0).getSkuCode());
            dto.setMinSalePrice(skus.stream()
                    .map(ProductSku::getSalePrice)
                    .filter(Objects::nonNull)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO));
            dto.setMaxSalePrice(skus.stream()
                    .map(ProductSku::getSalePrice)
                    .filter(Objects::nonNull)
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO));
            int totalStock = skus.stream()
                    .map(ProductSku::getStockQuantity)
                    .filter(Objects::nonNull)
                    .mapToInt(Integer::intValue)
                    .sum();
            dto.setTotalStockQuantity(totalStock);
            dto.setStockStatus(adminStockStatus(skus, totalStock));
        } else {
            dto.setMinSalePrice(BigDecimal.ZERO);
            dto.setMaxSalePrice(BigDecimal.ZERO);
            dto.setTotalStockQuantity(0);
            dto.setStockStatus(StockStatus.OUT_OF_STOCK);
        }

        dto.setThumbnailUrl(thumbnailUrl(images, skus));
        return dto;
    }

    private StockStatus adminStockStatus(List<ProductSku> skus, int totalStock) {
        if (totalStock == 0) {
            return StockStatus.OUT_OF_STOCK;
        }
        boolean lowStock = skus.stream().anyMatch(sku ->
                sku.getStockStatus() == StockStatus.LOW_STOCK
                        || nullableInt(sku.getStockQuantity()) <= nullableInt(sku.getLowStockThreshold()));
        return lowStock ? StockStatus.LOW_STOCK : StockStatus.IN_STOCK;
    }

    private int nullableInt(Integer value) {
        return value == null ? 0 : value;
    }

    private boolean matchesKeyword(Product product, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return true;
        }
        String normalizedKeyword = keyword.trim().toLowerCase();
        return containsIgnoreCase(product.getName(), normalizedKeyword)
                || containsIgnoreCase(product.getShortDescription(), normalizedKeyword)
                || containsIgnoreCase(product.getPrimaryKeyword(), normalizedKeyword);
    }

    private boolean matchesCategory(Product product, String categorySlug) {
        if (categorySlug == null || categorySlug.isBlank()) {
            return true;
        }
        return product.getCategory() != null
                && categorySlug.trim().equalsIgnoreCase(product.getCategory().getSlug());
    }

    private boolean containsIgnoreCase(String value, String normalizedKeyword) {
        return value != null && value.toLowerCase().contains(normalizedKeyword);
    }

    private Comparator<PublicProductSummaryResponse> summaryComparator(String sort) {
        if ("price_asc".equals(sort)) {
            return Comparator.comparing(summary -> nullablePrice(summary.minSalePrice()));
        }
        if ("price_desc".equals(sort)) {
            return Comparator.comparing(
                            (PublicProductSummaryResponse summary) -> nullablePrice(summary.maxSalePrice()))
                    .reversed();
        }
        return Comparator.comparing(PublicProductSummaryResponse::name, Comparator.nullsLast(String::compareToIgnoreCase));
    }

    private BigDecimal nullablePrice(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private PublicProductSummaryResponse toSummary(
            Product product,
            List<ProductSku> skus,
            List<ProductImage> images) {
        List<ProductSku> activeSkus = skus.stream()
                .filter(sku -> sku.getStatus() == SkuStatus.ACTIVE)
                .toList();
        BigDecimal minSalePrice = activeSkus.stream()
                .map(ProductSku::getSalePrice)
                .filter(Objects::nonNull)
                .min(BigDecimal::compareTo)
                .orElse(null);
        BigDecimal maxSalePrice = activeSkus.stream()
                .map(ProductSku::getSalePrice)
                .filter(Objects::nonNull)
                .max(BigDecimal::compareTo)
                .orElse(null);

        return new PublicProductSummaryResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                thumbnailUrl(images, activeSkus),
                product.getShortDescription(),
                minSalePrice,
                maxSalePrice,
                aggregateStockStatus(activeSkus));
    }

    private StockStatus aggregateStockStatus(List<ProductSku> skus) {
        boolean hasPurchasable = skus.stream()
                .anyMatch(sku -> sku.getStockQuantity() != null
                        && sku.getStockQuantity() > 0
                        && sku.getStockStatus() != StockStatus.OUT_OF_STOCK);
        if (!hasPurchasable) {
            return StockStatus.OUT_OF_STOCK;
        }
        boolean hasInStock = skus.stream().anyMatch(sku -> sku.getStockStatus() == StockStatus.IN_STOCK);
        return hasInStock ? StockStatus.IN_STOCK : StockStatus.LOW_STOCK;
    }

    private String thumbnailUrl(List<ProductImage> images, List<ProductSku> skus) {
        return images.stream()
                .filter(ProductImage::isThumbnail)
                .findFirst()
                .or(() -> images.stream().findFirst())
                .map(ProductImage::getUrl)
                .orElseGet(() -> skus.stream()
                        .map(ProductSku::getThumbnailMedia)
                        .filter(Objects::nonNull)
                        .map(media -> media.getUrl())
                        .findFirst()
                        .orElse(null));
    }

    private PublicProductCategoryResponse toCategory(ProductCategory category) {
        if (category == null) {
            return null;
        }
        return new PublicProductCategoryResponse(category.getId(), category.getName(), category.getSlug());
    }

    private List<PublicProductVersionResponse> toVersions(List<ProductSku> skus) {
        Map<ProductVersion, List<ProductSku>> skusByVersion = new LinkedHashMap<>();
        skus.stream()
                .filter(sku -> sku.getStatus() == SkuStatus.ACTIVE)
                .forEach(sku -> skusByVersion
                        .computeIfAbsent(sku.getVersion(), ignored -> new ArrayList<>())
                        .add(sku));
        List<PublicProductVersionResponse> versions = new ArrayList<>();

        skusByVersion.entrySet().stream()
                .sorted(Comparator.comparing(entry -> versionDisplayOrder(entry.getKey())))
                .forEach(entry -> versions.add(toVersion(entry.getKey(), entry.getValue())));

        return versions;
    }

    private Integer versionDisplayOrder(ProductVersion version) {
        return version == null || version.getDisplayOrder() == null ? 0 : version.getDisplayOrder();
    }

    private PublicProductVersionResponse toVersion(ProductVersion version, List<ProductSku> skus) {
        return new PublicProductVersionResponse(
                version == null ? null : version.getId(),
                version == null ? "Default" : version.getName(),
                versionDisplayOrder(version),
                skus.stream().map(this::toSku).toList());
    }

    private PublicProductSkuResponse toSku(ProductSku sku) {
        return new PublicProductSkuResponse(
                sku.getId(),
                sku.getSkuCode(),
                sku.getSkuName(),
                sku.getColor(),
                sku.getScent(),
                sku.getType(),
                sku.getOriginalPrice(),
                sku.getSalePrice(),
                sku.getStockQuantity(),
                sku.getStockStatus(),
                sku.getStatus(),
                sku.getThumbnailMedia() == null ? null : sku.getThumbnailMedia().getUrl());
    }

    private PublicProductImageResponse toImage(ProductImage image) {
        return new PublicProductImageResponse(
                image.getId(),
                image.getUrl(),
                image.getAltText(),
                image.isThumbnail());
    }

    private List<PublicProductSummaryResponse> relatedProducts(Product currentProduct) {
        List<Product> products = productRepository.findByStatusOrderByDisplayOrderAsc(ContentStatus.PUBLISHED)
                .stream()
                .filter(product -> !product.getId().equals(currentProduct.getId()))
                .limit(4)
                .toList();
        if (products.isEmpty()) {
            return List.of();
        }

        List<UUID> productIds = products.stream().map(Product::getId).toList();
        List<ProductSku> skus = productSkuRepository.findByProductIdIn(productIds);
        List<ProductImage> images = productImageRepository.findByProductIdIn(productIds);
        Map<UUID, List<ProductSku>> skusByProductId = skus.stream()
                .filter(sku -> sku.getProduct() != null)
                .collect(Collectors.groupingBy(sku -> sku.getProduct().getId()));
        Map<UUID, List<ProductImage>> imagesByProductId = images.stream()
                .filter(image -> image.getProduct() != null)
                .collect(Collectors.groupingBy(image -> image.getProduct().getId()));

        return products.stream()
                .map(product -> toSummary(
                        product,
                        skusByProductId.getOrDefault(product.getId(), List.of()),
                        imagesByProductId.getOrDefault(product.getId(), List.of())))
                .toList();
    }
}
