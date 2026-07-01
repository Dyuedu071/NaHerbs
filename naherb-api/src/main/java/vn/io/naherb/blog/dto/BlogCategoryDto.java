package vn.io.naherb.blog.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class BlogCategoryDto {
    private UUID id;
    private String name;
    private String slug;
}
