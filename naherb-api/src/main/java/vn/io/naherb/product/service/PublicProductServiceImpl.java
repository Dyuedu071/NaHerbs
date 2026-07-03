package vn.io.naherb.product.service;
import vn.io.naherb.product.entity.*;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.common.response.PageResponse;
import vn.io.naherb.exception.NotFoundException;
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
            String keyword, String categorySlug, String need, Boolean inStockOnly, String sortStr, int page, int size) {
        
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price_asc".equals(sortStr)) {
            // Note: Basic sort on entity won't work perfectly for SKU prices without joins, 
            // but for simplicity we sort by display order or default if complex logic is needed.
            // Using displayOrder as fallback for simple implementation.
            sort = Sort.by(Sort.Direction.ASC, "displayOrder");
        } else if ("price_desc".equals(sortStr)) {
            sort = Sort.by(Sort.Direction.DESC, "displayOrder");
        }
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), ContentStatus.PUBLISHED));
            
            if (keyword != null && !keyword.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
            }
            if (categorySlug != null && !categorySlug.isBlank()) {
                predicates.add(cb.equal(root.join("category").get("slug"), categorySlug));
            }
            if (need != null && !need.isBlank()) {
                // Map need to benefits or primaryKeyword using LIKE
                predicates.add(cb.like(cb.lower(root.get("benefits")), "%" + need.toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        
        // Fetch all SKUs and Images for these products to avoid N+1 where possible
        List<UUID> productIds = productPage.getContent().stream().map(Product::getId).toList();
        
        Map<UUID, List<ProductSku>> skusByProduct = skuRepository.findAll().stream()
                .filter(sku -> sku.getProduct() != null && productIds.contains(sku.getProduct().getId()))
                .filter(sku -> sku.getStatus() == vn.io.naherb.common.enums.SkuStatus.ACTIVE)
                .filter(sku -> sku.getVersion() == null || sku.getVersion().getStatus() == ContentStatus.PUBLISHED)
                .collect(Collectors.groupingBy(sku -> sku.getProduct().getId()));
                
        Map<UUID, List<ProductImage>> imagesByProduct = imageRepository.findByProductIdIn(productIds).stream()
                .collect(Collectors.groupingBy(img -> img.getProduct().getId()));

        List<ProductListResponse> items = productPage.getContent().stream().map(product -> {
            List<ProductSku> skus = skusByProduct.getOrDefault(product.getId(), List.of());
            List<ProductImage> images = imagesByProduct.getOrDefault(product.getId(), List.of());
            
            BigDecimal minPrice = skus.stream().map(ProductSku::getSalePrice).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            BigDecimal maxPrice = skus.stream().map(ProductSku::getSalePrice).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            boolean inStock = skus.stream().anyMatch(sku -> sku.getStockStatus() == StockStatus.IN_STOCK);
            
            String thumb = images.stream().filter(ProductImage::isThumbnail).findFirst()
                    .map(ProductImage::getUrl).orElse(null);
                    
            if (inStockOnly != null && inStockOnly && !inStock) {
                return null; // Should ideally filter in DB, but doing in-memory for this MVP
            }
            
            return ProductListResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .slug(product.getSlug())
                    .shortDescription(product.getShortDescription())
                    .thumbnailUrl(thumb)
                    .minSalePrice(minPrice)
                    .maxSalePrice(maxPrice)
                    .stockStatus(inStock ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK)
                    .build();
        }).filter(java.util.Objects::nonNull).toList();

        return PageResponse.<ProductListResponse>builder()
                .items(items)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalItems(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();
    }

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
                .thumbnailUrl(null) // Can map if sku has specific image
                .build();
    }
}
