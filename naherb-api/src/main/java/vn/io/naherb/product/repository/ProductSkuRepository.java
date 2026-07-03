package vn.io.naherb.product.repository;
import vn.io.naherb.product.entity.*;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.io.naherb.product.entity.ProductSku;

@Repository
public interface ProductSkuRepository extends JpaRepository<ProductSku, UUID> {
    List<ProductSku> findByProductId(UUID productId);
    List<ProductSku> findByVersionId(UUID versionId);
    boolean existsBySkuCode(String skuCode);
}
