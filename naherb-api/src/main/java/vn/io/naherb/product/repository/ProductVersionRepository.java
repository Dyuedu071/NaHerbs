package vn.io.naherb.product.repository;
import vn.io.naherb.product.entity.*;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.io.naherb.product.entity.ProductVersion;

@Repository
public interface ProductVersionRepository extends JpaRepository<ProductVersion, UUID> {
    List<ProductVersion> findByProductIdOrderByDisplayOrderAsc(UUID productId);
}
