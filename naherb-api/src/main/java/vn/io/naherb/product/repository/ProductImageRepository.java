package vn.io.naherb.product.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.io.naherb.product.ProductImage;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    List<ProductImage> findByProductId(UUID productId);
    List<ProductImage> findByProductIdIn(List<UUID> productIds);
}
