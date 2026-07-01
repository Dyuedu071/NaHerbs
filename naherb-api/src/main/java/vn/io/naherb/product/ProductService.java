package vn.io.naherb.product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.product.dto.ProductSummaryDto;
import vn.io.naherb.product.repository.ProductImageRepository;
import vn.io.naherb.product.repository.ProductRepository;
import vn.io.naherb.product.repository.ProductSkuRepository;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductSkuRepository skuRepository;
    private final ProductImageRepository imageRepository;

    public ProductService(ProductRepository productRepository,
                          ProductSkuRepository skuRepository,
                          ProductImageRepository imageRepository) {
        this.productRepository = productRepository;
        this.skuRepository = skuRepository;
        this.imageRepository = imageRepository;
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
}
