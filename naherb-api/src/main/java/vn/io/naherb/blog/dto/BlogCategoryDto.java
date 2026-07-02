package vn.io.naherb.blog.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class BlogCategoryDto implements Serializable {
    private static final long serialVersionUID = 1L;
    private UUID id;
    private String name;
    private String slug;
}
