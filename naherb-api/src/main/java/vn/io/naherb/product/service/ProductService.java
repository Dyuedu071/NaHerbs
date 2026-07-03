package vn.io.naherb.product.service;
import vn.io.naherb.product.entity.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.common.enums.SkuStatus;
import vn.io.naherb.product.dto.ProductSkuDetailDto;
import vn.io.naherb.product.dto.ProductSummaryDto;
import vn.io.naherb.product.dto.ProductVersionDetailDto;
import vn.io.naherb.product.dto.UpdateStockRequest;
import vn.io.naherb.product.dto.UpsertProductSkuRequest;
import vn.io.naherb.product.dto.ProductDetailResponse;
import vn.io.naherb.product.dto.ProductCategoryResponse;
import vn.io.naherb.product.dto.ProductVersionResponse;
import vn.io.naherb.product.dto.ProductImageResponse;
import vn.io.naherb.product.dto.UpsertProductImageRequest;
import vn.io.naherb.product.dto.UpsertProductRequest;
import vn.io.naherb.product.dto.UpsertProductVersionRequest;
import vn.io.naherb.media.MediaAsset;
import vn.io.naherb.media.MediaAssetRepository;
import vn.io.naherb.product.repository.ProductCategoryRepository;
import vn.io.naherb.product.repository.ProductImageRepository;
import vn.io.naherb.product.repository.ProductRepository;
import vn.io.naherb.product.repository.ProductSkuRepository;
import vn.io.naherb.product.repository.ProductVersionRepository;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.common.enums.ContentStatus;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductSkuRepository skuRepository;
    private final ProductImageRepository imageRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductVersionRepository versionRepository;
    private final MediaAssetRepository mediaAssetRepository;

    public ProductService(ProductRepository productRepository,
                          ProductSkuRepository skuRepository,
                          ProductImageRepository imageRepository,
                          ProductCategoryRepository categoryRepository,
                          ProductVersionRepository versionRepository,
                          MediaAssetRepository mediaAssetRepository) {
        this.productRepository = productRepository;
        this.skuRepository = skuRepository;
        this.imageRepository = imageRepository;
        this.categoryRepository = categoryRepository;
        this.versionRepository = versionRepository;
        this.mediaAssetRepository = mediaAssetRepository;
    }

    public List<ProductSummaryDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<UUID> productIds = products.stream().map(Product::getId).toList();
        
        Map<UUID, List<ProductSku>> skusByProduct = skuRepository.findAll().stream()
                .filter(sku -> sku.getProduct() != null && productIds.contains(sku.getProduct().getId()))
                .collect(Collectors.groupingBy(sku -> sku.getProduct().getId()));
                
        Map<UUID, List<ProductImage>> imagesByProduct = imageRepository.findByProductIdIn(productIds).stream()
                .collect(Collectors.groupingBy(img -> img.getProduct().getId()));

        return products.stream().map(product -> {
            ProductSummaryDto dto = new ProductSummaryDto();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setSlug(product.getSlug());
            dto.setStatus(product.getStatus());
            
            if (product.getCategory() != null) {
                dto.setCategoryName(product.getCategory().getName());
                dto.setCategorySlug(product.getCategory().getSlug());
            }
            
            List<ProductSku> skus = skusByProduct.getOrDefault(product.getId(), List.of());
            dto.setSkuCount(skus.size());
            if (!skus.isEmpty()) {
                dto.setSkuCode(skus.get(0).getSkuCode());
                BigDecimal minPrice = skus.stream().map(ProductSku::getSalePrice).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
                BigDecimal maxPrice = skus.stream().map(ProductSku::getSalePrice).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
                int totalStock = skus.stream().mapToInt(ProductSku::getStockQuantity).sum();
                dto.setMinSalePrice(minPrice);
                dto.setMaxSalePrice(maxPrice);
                dto.setTotalStockQuantity(totalStock);
                
                if (totalStock == 0) {
                    dto.setStockStatus(StockStatus.OUT_OF_STOCK);
                } else if (skus.stream().anyMatch(s -> s.getStockStatus() == StockStatus.LOW_STOCK || s.getStockQuantity() <= s.getLowStockThreshold())) {
                    dto.setStockStatus(StockStatus.LOW_STOCK);
                } else {
                    dto.setStockStatus(StockStatus.IN_STOCK);
                }
            } else {
                dto.setSkuCount(0);
                dto.setMinSalePrice(BigDecimal.ZERO);
                dto.setMaxSalePrice(BigDecimal.ZERO);
                dto.setTotalStockQuantity(0);
                dto.setStockStatus(StockStatus.OUT_OF_STOCK);
            }
            
            List<ProductImage> images = imagesByProduct.getOrDefault(product.getId(), List.of());
            String thumb = images.stream().filter(ProductImage::isThumbnail).findFirst()
                    .map(ProductImage::getUrl).orElse(null);
            dto.setThumbnailUrl(thumb);
            
            return dto;
        }).collect(Collectors.toList());
    }

    public ProductDetailResponse getProductDetailById(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));

        ProductCategoryResponse categoryResponse = null;
        if (product.getCategory() != null) {
            categoryResponse = ProductCategoryResponse.builder()
                    .id(product.getCategory().getId())
                    .name(product.getCategory().getName())
                    .slug(product.getCategory().getSlug())
                    .build();
        }

        List<ProductImageResponse> images = imageRepository.findByProductIdIn(List.of(productId)).stream()
                .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                .map(img -> ProductImageResponse.builder()
                        .id(img.getId())
                        .url(img.getUrl())
                        .altText(img.getAltText())
                        .isThumbnail(img.isThumbnail())
                        .displayOrder(img.getDisplayOrder())
                        .build())
                .collect(Collectors.toList());

        return ProductDetailResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .category(categoryResponse)
                .shortDescription(product.getShortDescription())
                .detailDescription(product.getDetailDescription())
                .usageInstruction(product.getUsageInstruction())
                .safetyNote(product.getSafetyNote())
                .seoTitle(product.getSeoTitle())
                .seoDescription(product.getSeoDescription())
                .benefits(product.getBenefits())
                .preservationInstruction(product.getPreservationInstruction())
                .primaryKeyword(product.getPrimaryKeyword())
                .isFeatured(product.isFeatured())
                .displayOrder(product.getDisplayOrder())
                .status(product.getStatus())
                .images(images)
                .build();
    }

    @Transactional
    public Product createProduct(UpsertProductRequest request) {
        if (productRepository.existsBySlug(request.getSlug())) {
            throw new vn.io.naherb.exception.ConflictException("Đường dẫn (slug) sản phẩm đã tồn tại, vui lòng chọn đường dẫn khác");
        }
        
        Product product = new Product();
        mapRequestToProduct(request, product);
        product = productRepository.save(product);
        handleProductImages(product, request.getImages());
        
        if (request.getVersions() != null && !request.getVersions().isEmpty()) {
            for (int i = 0; i < request.getVersions().size(); i++) {
                var vReq = request.getVersions().get(i);
                ProductVersion version = new ProductVersion();
                version.setProduct(product);
                version.setName(vReq.getName());
                version.setCode(vReq.getCode());
                version.setDisplayOrder(vReq.getDisplayOrder() != null ? vReq.getDisplayOrder() : i);
                version.setStatus(vReq.getStatus() != null ? vReq.getStatus() : ContentStatus.PUBLISHED);
                version = versionRepository.save(version);
                
                if (vReq.getSkus() != null && !vReq.getSkus().isEmpty()) {
                    for (int j = 0; j < vReq.getSkus().size(); j++) {
                        var sReq = vReq.getSkus().get(j);
                        if (sReq.getSkuCode() != null && !sReq.getSkuCode().isEmpty() && skuRepository.existsBySkuCode(sReq.getSkuCode())) {
                            throw new vn.io.naherb.exception.ConflictException("Mã SKU '" + sReq.getSkuCode() + "' đã tồn tại, vui lòng chọn mã khác");
                        }
                        if (sReq.getOriginalPrice() != null && sReq.getOriginalPrice().compareTo(sReq.getSalePrice()) < 0) {
                            throw new vn.io.naherb.exception.BadRequestException("Giá gốc không được nhỏ hơn giá bán (SKU: " + sReq.getName() + ")");
                        }
                        ProductSku sku = new ProductSku();
                        sku.setProduct(product);
                        sku.setVersion(version);
                        sku.setSkuCode(sReq.getSkuCode());
                        sku.setSkuName(sReq.getName());
                        sku.setColor(sReq.getColor());
                        sku.setScent(sReq.getScent());
                        sku.setType(sReq.getType());
                        sku.setOriginalPrice(sReq.getOriginalPrice());
                        sku.setSalePrice(sReq.getSalePrice());
                        sku.setStockQuantity(sReq.getStockQuantity() != null ? sReq.getStockQuantity() : 0);
                        sku.setStatus(sReq.getStatus() != null ? sReq.getStatus() : SkuStatus.ACTIVE);
                        skuRepository.save(sku);
                    }
                }
            }
        } else if (Boolean.TRUE.equals(request.getCreateDefaultSku()) && request.getSalePrice() != null) {
            if (request.getSkuCode() != null && !request.getSkuCode().isEmpty() && skuRepository.existsBySkuCode(request.getSkuCode())) {
                throw new vn.io.naherb.exception.ConflictException("Mã SKU '" + request.getSkuCode() + "' đã tồn tại, vui lòng chọn mã khác");
            }
            if (request.getOriginalPrice() != null && request.getOriginalPrice().compareTo(request.getSalePrice()) < 0) {
                throw new vn.io.naherb.exception.BadRequestException("Giá gốc không được nhỏ hơn giá bán");
            }
            ProductVersion version = new ProductVersion();
            version.setProduct(product);
            version.setName("Mặc định");
            version.setStatus(ContentStatus.PUBLISHED);
            version.setDisplayOrder(1);
            version = versionRepository.save(version);
            
            ProductSku sku = new ProductSku();
            sku.setProduct(product);
            sku.setVersion(version);
            sku.setSkuCode(request.getSkuCode());
            sku.setSkuName(product.getName());
            sku.setOriginalPrice(request.getOriginalPrice());
            sku.setSalePrice(request.getSalePrice());
            sku.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
            sku.setStatus(SkuStatus.ACTIVE);
            skuRepository.save(sku);
        }
        
        return product;
    }

    public Product updateProduct(UUID productId, UpsertProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + productId));
        mapRequestToProduct(request, product);
        product = productRepository.save(product);
        handleProductImages(product, request.getImages());
        return product;
    }

    public void archiveProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + productId));
        product.setStatus(ContentStatus.ARCHIVED);
        productRepository.save(product);
    }

    private void mapRequestToProduct(UpsertProductRequest request, Product product) {
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setShortDescription(request.getShortDescription());
        product.setDetailDescription(request.getDetailDescription());
        product.setUsageInstruction(request.getUsageInstruction());
        product.setSafetyNote(request.getSafetyNote());
        product.setSeoTitle(request.getSeoTitle());
        product.setSeoDescription(request.getSeoDescription());
        product.setBenefits(request.getBenefits());
        product.setPreservationInstruction(request.getPreservationInstruction());
        product.setPrimaryKeyword(request.getPrimaryKeyword());
        product.setFeatured(request.isFeatured());
        product.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        product.setStatus(request.getStatus());

        if (request.getCategoryId() != null) {
            ProductCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }
    }

    private void handleProductImages(Product product, List<UpsertProductImageRequest> imageRequests) {
        // Delete old images
        List<ProductImage> existingImages = imageRepository.findByProductIdIn(List.of(product.getId()));
        imageRepository.deleteAll(existingImages);

        if (imageRequests == null || imageRequests.isEmpty()) {
            return;
        }

        List<ProductImage> newImages = imageRequests.stream().map(req -> {
            ProductImage img = new ProductImage();
            img.setProduct(product);
            img.setUrl(req.getUrl());
            img.setAltText(req.getAltText());
            img.setThumbnail(req.isThumbnail());
            img.setDisplayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0);
            if (req.getMediaId() != null) {
                MediaAsset media = mediaAssetRepository.findById(req.getMediaId()).orElse(null);
                img.setMedia(media);
            }
            return img;
        }).collect(Collectors.toList());

        imageRepository.saveAll(newImages);
    }

    // ─── Version management ──────────────────────────────────────────────────

    public List<ProductVersionDetailDto> getVersionsByProduct(UUID productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));

        List<ProductVersion> versions = versionRepository.findByProductIdOrderByDisplayOrderAsc(productId);
        List<ProductSku> allSkus = skuRepository.findByProductId(productId);

        Map<UUID, List<ProductSku>> skusByVersion = allSkus.stream()
                .filter(s -> s.getVersion() != null)
                .collect(Collectors.groupingBy(s -> s.getVersion().getId()));

        return versions.stream().map(v -> {
            ProductVersionDetailDto dto = new ProductVersionDetailDto();
            dto.setId(v.getId());
            dto.setName(v.getName());
            dto.setCode(v.getCode());
            dto.setDescription(v.getDescription());
            dto.setDisplayOrder(v.getDisplayOrder());
            dto.setStatus(v.getStatus());
            List<ProductSku> vSkus = skusByVersion.getOrDefault(v.getId(), List.of());
            dto.setSkus(vSkus.stream().map(this::mapSkuToDto).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public ProductVersionDetailDto createVersion(UUID productId, UpsertProductVersionRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));

        ProductVersion version = new ProductVersion();
        version.setProduct(product);
        version.setName(request.getName());
        version.setCode(request.getCode());
        version.setDisplayOrder(request.getDisplayOrder());
        version.setStatus(request.getStatus() != null ? request.getStatus() : ContentStatus.PUBLISHED);

        version = versionRepository.save(version);
        
        ProductVersionDetailDto dto = new ProductVersionDetailDto();
        dto.setId(version.getId());
        dto.setName(version.getName());
        dto.setCode(version.getCode());
        dto.setDescription(version.getDescription());
        dto.setDisplayOrder(version.getDisplayOrder());
        dto.setStatus(version.getStatus());
        dto.setSkus(List.of());
        return dto;
    }

    @Transactional
    public ProductVersionDetailDto updateVersion(UUID versionId, UpsertProductVersionRequest request) {
        ProductVersion version = versionRepository.findById(versionId)
                .orElseThrow(() -> new NotFoundException("Phiên bản không tồn tại"));

        version.setName(request.getName());
        version.setCode(request.getCode());
        version.setDisplayOrder(request.getDisplayOrder());
        version.setStatus(request.getStatus() != null ? request.getStatus() : ContentStatus.PUBLISHED);

        version = versionRepository.save(version);
        
        ProductVersionDetailDto dto = new ProductVersionDetailDto();
        dto.setId(version.getId());
        dto.setName(version.getName());
        dto.setCode(version.getCode());
        dto.setDescription(version.getDescription());
        dto.setDisplayOrder(version.getDisplayOrder());
        dto.setStatus(version.getStatus());
        dto.setSkus(List.of());
        return dto;
    }

    @Transactional
    public void deleteVersion(UUID versionId) {
        ProductVersion version = versionRepository.findById(versionId)
                .orElseThrow(() -> new NotFoundException("Phiên bản không tồn tại"));
        
        List<ProductSku> skus = skuRepository.findByVersionId(versionId);
        skuRepository.deleteAll(skus);
        
        versionRepository.delete(version);
    }

    // ─── SKU management ──────────────────────────────────────────────────────

    public List<ProductSkuDetailDto> getSkusByProduct(UUID productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));
        return skuRepository.findByProductId(productId).stream()
                .map(this::mapSkuToDto)
                .collect(Collectors.toList());
    }

    public ProductSkuDetailDto createSku(UUID productId, UpsertProductSkuRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));
        ProductVersion version = versionRepository.findById(request.getVersionId())
                .orElseThrow(() -> new NotFoundException("Version not found: " + request.getVersionId()));

        ProductSku sku = new ProductSku();
        sku.setProduct(product);
        sku.setVersion(version);
        mapRequestToSku(request, sku);
        sku = skuRepository.save(sku);
        return mapSkuToDto(sku);
    }

    public ProductSkuDetailDto updateSku(UUID skuId, UpsertProductSkuRequest request) {
        ProductSku sku = skuRepository.findById(skuId)
                .orElseThrow(() -> new NotFoundException("SKU not found: " + skuId));
        ProductVersion version = versionRepository.findById(request.getVersionId())
                .orElseThrow(() -> new NotFoundException("Version not found: " + request.getVersionId()));
        sku.setVersion(version);
        mapRequestToSku(request, sku);
        sku = skuRepository.save(sku);
        return mapSkuToDto(sku);
    }

    @Transactional
    public void updateSkuStock(UUID skuId, UpdateStockRequest request) {
        ProductSku sku = skuRepository.findById(skuId)
                .orElseThrow(() -> new NotFoundException("SKU không tồn tại"));
        
        sku.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        skuRepository.save(sku);
    }

    @Transactional
    public void deleteSku(UUID skuId) {
        ProductSku sku = skuRepository.findById(skuId)
                .orElseThrow(() -> new NotFoundException("SKU không tồn tại"));
        skuRepository.delete(sku);
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    private void mapRequestToSku(UpsertProductSkuRequest request, ProductSku sku) {
        sku.setSkuCode(request.getSkuCode());
        sku.setSkuName(request.getName());
        sku.setColor(request.getColor());
        sku.setScent(request.getScent());
        sku.setType(request.getType());
        sku.setOriginalPrice(request.getOriginalPrice());
        sku.setSalePrice(request.getSalePrice());
        sku.setStockQuantity(request.getStockQuantity());
        sku.setStatus(request.getStatus() != null ? request.getStatus() : SkuStatus.ACTIVE);
        int qty = request.getStockQuantity();
        if (qty <= 0) {
            sku.setStockStatus(StockStatus.OUT_OF_STOCK);
        } else if (qty <= sku.getLowStockThreshold()) {
            sku.setStockStatus(StockStatus.LOW_STOCK);
        } else {
            sku.setStockStatus(StockStatus.IN_STOCK);
        }
    }

    private ProductSkuDetailDto mapSkuToDto(ProductSku sku) {
        ProductSkuDetailDto dto = new ProductSkuDetailDto();
        dto.setId(sku.getId());
        dto.setVersionId(sku.getVersion() != null ? sku.getVersion().getId() : null);
        dto.setSkuCode(sku.getSkuCode());
        dto.setSkuName(sku.getSkuName());
        dto.setColor(sku.getColor());
        dto.setScent(sku.getScent());
        dto.setType(sku.getType());
        dto.setOriginalPrice(sku.getOriginalPrice());
        dto.setSalePrice(sku.getSalePrice());
        dto.setStockQuantity(sku.getStockQuantity());
        dto.setStockStatus(sku.getStockStatus());
        dto.setStatus(sku.getStatus());
        dto.setDisplayOrder(sku.getDisplayOrder());
        return dto;
    }
}
