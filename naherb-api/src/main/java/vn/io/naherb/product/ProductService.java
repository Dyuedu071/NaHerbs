package vn.io.naherb.product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import vn.io.naherb.product.dto.ProductSummaryDto;
import vn.io.naherb.product.repository.ProductRepository;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductSummaryDto> getAllProducts() {
        return productRepository.findAll().stream().map(product -> {
            ProductSummaryDto dto = new ProductSummaryDto();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setSlug(product.getSlug());
            return dto;
        }).collect(Collectors.toList());
    }
}
