package vn.io.naherb.blog;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.media.MediaAsset;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BlogPost extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private BlogCategory category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thumbnail_media_id")
    private MediaAsset thumbnailMedia;

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

    @Column(name = "published_at")
    private Instant publishedAt;
}
