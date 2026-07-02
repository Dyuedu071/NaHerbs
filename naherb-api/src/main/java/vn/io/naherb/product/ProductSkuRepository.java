package vn.io.naherb.product;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductSkuRepository extends JpaRepository<ProductSku, UUID> {
    List<ProductSku> findByProductInOrderByDisplayOrderAscCreatedAtAsc(List<Product> products);

    List<ProductSku> findByProductOrderByDisplayOrderAscCreatedAtAsc(Product product);
}
