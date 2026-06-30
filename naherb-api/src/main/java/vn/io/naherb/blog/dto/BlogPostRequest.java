package vn.io.naherb.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.io.naherb.common.enums.ContentStatus;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Content is required")
    private String content;

    private String summary;

    private UUID categoryId;
    
    private UUID thumbnailMediaId;

    @Size(max = 60, message = "SEO Title must be at most 60 characters")
    private String seoTitle;

    @Size(max = 160, message = "SEO Description must be at most 160 characters")
    private String seoDescription;

    private String primaryKeyword;

    private ContentStatus status;
    private boolean isFeatured;

    private List<UUID> productIds; // Max 6 products, checked in Service
}
