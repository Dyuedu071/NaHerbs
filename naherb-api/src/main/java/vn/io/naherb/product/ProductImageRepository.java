package vn.io.naherb.product;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    List<ProductImage> findByProductInOrderByDisplayOrderAscCreatedAtAsc(List<Product> products);

    List<ProductImage> findByProductOrderByDisplayOrderAscCreatedAtAsc(Product product);
}
