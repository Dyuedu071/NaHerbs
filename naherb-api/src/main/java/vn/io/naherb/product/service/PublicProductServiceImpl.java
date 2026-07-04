package vn.io.naherb.product.service;
import vn.io.naherb.product.entity.*;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.enums.OrderStatus;
import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.common.response.PageResponse;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.order.OrderItemRepository;
import vn.io.naherb.product.entity.Product;
import vn.io.naherb.product.entity.ProductCategory;
import vn.io.naherb.product.entity.ProductImage;
import vn.io.naherb.product.entity.ProductSku;
import vn.io.naherb.product.entity.ProductVersion;
import vn.io.naherb.product.dto.ProductCategoryResponse;
import vn.io.naherb.product.dto.ProductDetailResponse;
import vn.io.naherb.product.dto.ProductImageResponse;
import vn.io.naherb.product.dto.ProductListResponse;
import vn.io.naherb.product.dto.ProductSkuResponse;
import vn.io.naherb.product.dto.ProductVersionResponse;
import vn.io.naherb.product.repository.ProductCategoryRepository;
import vn.io.naherb.product.repository.ProductImageRepository;
import vn.io.naherb.product.repository.ProductRepository;
import vn.io.naherb.product.repository.ProductSkuRepository;
import vn.io.naherb.product.repository.ProductVersionRepository;

@Service
@RequiredArgsConstructor
public class PublicProductServiceImpl implements PublicProductService {

    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductSkuRepository skuRepository;
    private final ProductVersionRepository versionRepository;
    private final ProductImageRepository imageRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductCategoryResponse> getCategories(ContentStatus status) {
        ContentStatus filterStatus = status != null ? status : ContentStatus.PUBLISHED;
        return categoryRepository.findByStatusOrderByDisplayOrderAsc(filterStatus)
                .stream()
                .map(this::mapCategoryToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductListResponse> searchProducts(
            String keyword, List<String> categorySlugs, String need, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, Boolean inStockOnly, String sortStr, int page, int size) {

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), ContentStatus.PUBLISHED));
            
            if (keyword != null && !keyword.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
            }
            if (categorySlugs != null && !categorySlugs.isEmpty()) {
                predicates.add(root.join("category").get("slug").in(categorySlugs));
            }
            if (need != null && !need.isBlank()) {
                // Map need to benefits or primaryKeyword using LIKE
                predicates.add(cb.like(cb.lower(root.get("benefits")), "%" + need.toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Product> matchedProducts = productRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"));

        // Fetch all SKUs and Images for these products to avoid N+1 where possible
        List<UUID> productIds = matchedProducts.stream().map(Product::getId).toList();

        Map<UUID, List<ProductSku>> skusByProduct = productIds.isEmpty() ? Map.of() : skuRepository.findByProductIdIn(productIds).stream()
                .filter(sku -> sku.getStatus() == vn.io.naherb.common.enums.SkuStatus.ACTIVE)
                .filter(sku -> sku.getVersion() == null || sku.getVersion().getStatus() == ContentStatus.PUBLISHED)
                .collect(Collectors.groupingBy(sku -> sku.getProduct().getId()));

        Map<UUID, List<ProductImage>> imagesByProduct = productIds.isEmpty() ? Map.of() : imageRepository.findByProductIdIn(productIds).stream()
                .collect(Collectors.groupingBy(img -> img.getProduct().getId()));

        Map<UUID, Long> soldQuantityByProduct = productIds.isEmpty()
                ? Map.of()
                : orderItemRepository.sumSoldQuantityByProductId(productIds, OrderStatus.CANCELLED).stream()
                        .collect(Collectors.toMap(
                                row -> (UUID) row[0],
                                row -> ((Number) row[1]).longValue()));

        List<ProductListItem> filteredItems = matchedProducts.stream().map(product -> {
            List<ProductSku> skus = skusByProduct.getOrDefault(product.getId(), List.of());
            List<ProductImage> images = imagesByProduct.getOrDefault(product.getId(), List.of());

            ProductSku cheapestSku = skus.stream()
                    .filter(s -> s.getSalePrice() != null)
                    .min(Comparator.comparing(ProductSku::getSalePrice))
                    .orElse(null);
            BigDecimal minSalePrice = cheapestSku != null ? cheapestSku.getSalePrice() : BigDecimal.ZERO;
            BigDecimal originalPrice = cheapestSku != null ? cheapestSku.getOriginalPrice() : null;
            BigDecimal maxSalePrice = skus.stream().map(ProductSku::getSalePrice).filter(Objects::nonNull).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            boolean inStock = skus.stream().anyMatch(sku -> sku.getStockStatus() == StockStatus.IN_STOCK);

            String thumb = images.stream().filter(ProductImage::isThumbnail).findFirst()
                    .map(ProductImage::getUrl).orElse(null);

            if (inStockOnly != null && inStockOnly && !inStock) {
                return null;
            }
            if (minPrice != null && maxSalePrice.compareTo(minPrice) < 0) {
                return null;
            }
            if (maxPrice != null && minSalePrice.compareTo(maxPrice) > 0) {
                return null;
            }

            ProductListResponse response = ProductListResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .slug(product.getSlug())
                    .shortDescription(product.getShortDescription())
                    .thumbnailUrl(thumb)
                    .originalPrice(originalPrice)
                    .minSalePrice(minSalePrice)
                    .maxSalePrice(maxSalePrice)
                    .stockStatus(inStock ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK)
                    .build();

            return new ProductListItem(
                    product,
                    response,
                    priceForSort(minSalePrice),
                    soldQuantityByProduct.getOrDefault(product.getId(), 0L));
        }).filter(Objects::nonNull).collect(Collectors.toCollection(ArrayList::new));

        filteredItems.sort(productComparator(sortStr));

        int normalizedPage = Math.max(page, 0);
        int normalizedSize = size <= 0 ? 12 : Math.min(size, 100);
        int fromIndex = Math.min(normalizedPage * normalizedSize, filteredItems.size());
        int toIndex = Math.min(fromIndex + normalizedSize, filteredItems.size());
        List<ProductListResponse> items = filteredItems.subList(fromIndex, toIndex).stream()
                .map(ProductListItem::response)
                .toList();
        int totalPages = filteredItems.isEmpty()
                ? 0
                : (int) Math.ceil((double) filteredItems.size() / normalizedSize);

        return PageResponse.<ProductListResponse>builder()
                .items(items)
                .page(normalizedPage)
                .size(normalizedSize)
                .totalItems(filteredItems.size())
                .totalPages(totalPages)
                .build();
    }

    private static Comparator<ProductListItem> productComparator(String sortStr) {
        Comparator<ProductListItem> newestFirst = Comparator
                .comparing((ProductListItem item) -> item.product().getCreatedAt(), Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(item -> item.product().getDisplayOrder(), Comparator.nullsLast(Comparator.naturalOrder()))
                .thenComparing(item -> item.product().getName(), String.CASE_INSENSITIVE_ORDER);

        if ("price_asc".equals(sortStr)) {
            return Comparator
                    .comparing(ProductListItem::sortPrice, Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(newestFirst);
        }
        if ("price_desc".equals(sortStr)) {
            return Comparator
                    .comparing(ProductListItem::sortPrice, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(newestFirst);
        }
        if ("best_selling".equals(sortStr)) {
            return Comparator
                    .comparing(ProductListItem::soldQuantity, Comparator.reverseOrder())
                    .thenComparing(newestFirst);
        }
        return newestFirst;
    }

    private static BigDecimal priceForSort(BigDecimal price) {
        return price != null && price.signum() > 0 ? price : null;
    }

    private record ProductListItem(
            Product product,
            ProductListResponse response,
            BigDecimal sortPrice,
            Long soldQuantity) {}

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductDetail(String slug) {
        Product product = productRepository.findBySlugAndStatus(slug, ContentStatus.PUBLISHED)
                .orElseThrow(() -> new NotFoundException("Product not found"));
                
        List<ProductVersion> versions = versionRepository.findByProductIdOrderByDisplayOrderAsc(product.getId())
                .stream().filter(v -> v.getStatus() == ContentStatus.PUBLISHED).toList();
        List<ProductSku> skus = skuRepository.findByProductId(product.getId())
                .stream().filter(s -> s.getStatus() == vn.io.naherb.common.enums.SkuStatus.ACTIVE).toList();
        List<ProductImage> images = imageRepository.findByProductId(product.getId());
        
        List<ProductVersionResponse> versionResponses = versions.stream().map(v -> {
            List<ProductSkuResponse> skuResponses = skus.stream()
                    .filter(s -> s.getVersion() != null && s.getVersion().getId().equals(v.getId()))
                    .map(this::mapSkuToResponse)
                    .toList();
            return ProductVersionResponse.builder()
                    .id(v.getId())
                    .name(v.getName())
                    .skus(skuResponses)
                    .build();
        }).toList();
        
        List<ProductImageResponse> imageResponses = images.stream()
                .map(img -> ProductImageResponse.builder()
                        .id(img.getId())
                        .url(img.getUrl())
                        .altText(img.getAltText())
                        .isThumbnail(img.isThumbnail())
                        .build())
                .toList();

        return ProductDetailResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .category(mapCategoryToResponse(product.getCategory()))
                .shortDescription(product.getShortDescription())
                .detailDescription(product.getDetailDescription())
                .usageInstruction(product.getUsageInstruction())
                .safetyNote(product.getSafetyNote())
                .seoTitle(product.getSeoTitle())
                .seoDescription(product.getSeoDescription())
                .versions(versionResponses)
                .images(imageResponses)
                .relatedProducts(List.of()) // Not implemented in MVP for simplicity
                .build();
    }
    
    private ProductCategoryResponse mapCategoryToResponse(ProductCategory category) {
        if (category == null) return null;
        return ProductCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .build();
    }
    
    private ProductSkuResponse mapSkuToResponse(ProductSku sku) {
        return ProductSkuResponse.builder()
                .id(sku.getId())
                .skuCode(sku.getSkuCode())
                .name(sku.getSkuName())
                .color(sku.getColor())
                .scent(sku.getScent())
                .type(sku.getType())
                .originalPrice(sku.getOriginalPrice())
                .salePrice(sku.getSalePrice())
                .stockQuantity(sku.getStockQuantity())
                .stockStatus(sku.getStockStatus())
                .status(sku.getStatus())
                .thumbnailUrl(sku.getThumbnailMedia() != null ? sku.getThumbnailMedia().getUrl() : null)
                .build();
    }
}
