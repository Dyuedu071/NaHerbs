package vn.io.naherb.product;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.common.enums.SkuStatus;
import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.media.MediaAsset;

@Entity
@Table(name = "product_skus")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductSku extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "version_id")
    private ProductVersion version;

    @Column(name = "sku_code", unique = true, length = 100)
    private String skuCode;

    @Column(name = "sku_name", nullable = false)
    private String skuName;

    @Column(length = 100)
    private String color;

    @Column(length = 100)
    private String scent;

    @Column(length = 100)
    private String size;

    @Column(length = 100)
    private String type;

    @Column(name = "original_price")
    private BigDecimal originalPrice;

    @Column(name = "sale_price", nullable = false)
    private BigDecimal salePrice;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "low_stock_threshold", nullable = false)
    private Integer lowStockThreshold = 3;

    @Enumerated(EnumType.STRING)
    @Column(name = "stock_status", nullable = false)
    private StockStatus stockStatus = StockStatus.IN_STOCK;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkuStatus status = SkuStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thumbnail_media_id")
    private MediaAsset thumbnailMedia;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
