package vn.io.naherb.product.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ProductSummaryDto {
    private UUID id;
    private String name;
    private String slug;
}
