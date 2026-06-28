package vn.io.naherb.product;

import jakarta.persistence.*;
import lombok.*;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.media.MediaAsset;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sku_id")
    private ProductSku sku;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_id")
    private MediaAsset media;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "is_thumbnail", nullable = false)
    private boolean isThumbnail = false;
}
