package vn.io.naherb.blog.dto;

import lombok.Data;
import vn.io.naherb.common.enums.ContentStatus;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class BlogPostResponse implements Serializable {
    private static final long serialVersionUID = 1L;
    private UUID id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String seoTitle;
    private String seoDescription;
    private String primaryKeyword;
    private ContentStatus status;
    private boolean isFeatured;
    private Instant publishedAt;
    private Instant createdAt;
    private Instant updatedAt;
    
    private String thumbnailUrl;
    private UUID thumbnailMediaId;
    private BlogCategoryDto category;
    
    private List<ProductSummary> products;

    @Data
    public static class ProductSummary implements Serializable {
        private static final long serialVersionUID = 1L;
        private UUID id;
        private String name;
        private String slug;
        private String seoTitle;
        private String thumbnailUrl;
        private ContentStatus status;
    }
}
