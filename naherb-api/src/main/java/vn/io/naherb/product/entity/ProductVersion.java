package vn.io.naherb.product.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.common.enums.ContentStatus;

@Entity
@Table(name = "product_versions")
@Getter
@Setter
@NoArgsConstructor
public class ProductVersion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String name;

    @Column(length = 100)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentStatus status = ContentStatus.PUBLISHED;
}
