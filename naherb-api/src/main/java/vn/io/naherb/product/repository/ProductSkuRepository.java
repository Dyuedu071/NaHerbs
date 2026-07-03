package vn.io.naherb.product.repository;
import vn.io.naherb.product.entity.*;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.io.naherb.common.enums.StockStatus;

@Repository
public interface ProductSkuRepository extends JpaRepository<ProductSku, UUID> {
    List<ProductSku> findByProductId(UUID productId);
    List<ProductSku> findByVersionId(UUID versionId);
    boolean existsBySkuCode(String skuCode);

    List<ProductSku> findByProductIdIn(List<UUID> productIds);

    List<ProductSku> findByStockStatusInOrderByStockQuantityAsc(List<StockStatus> statuses, Pageable pageable);
}
