package vn.io.naherb.product;

import jakarta.persistence.*;
import lombok.*;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.common.enums.ContentStatus;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProductCategory category;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "detail_description", columnDefinition = "TEXT")
    private String detailDescription;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "usage_instruction", columnDefinition = "TEXT")
    private String usageInstruction;

    @Column(name = "preservation_instruction", columnDefinition = "TEXT")
    private String preservationInstruction;

    @Column(name = "safety_note", columnDefinition = "TEXT")
    private String safetyNote;

    @Column(name = "seo_title")
    private String seoTitle;

    @Column(name = "seo_description", columnDefinition = "TEXT")
    private String seoDescription;

    @Column(name = "primary_keyword")
    private String primaryKeyword;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentStatus status = ContentStatus.DRAFT;

    @Column(name = "is_featured", nullable = false)
    private boolean isFeatured = false;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
