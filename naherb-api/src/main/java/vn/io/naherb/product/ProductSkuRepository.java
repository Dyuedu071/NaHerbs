package vn.io.naherb.product;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductSkuRepository extends JpaRepository<ProductSku, UUID> {}
