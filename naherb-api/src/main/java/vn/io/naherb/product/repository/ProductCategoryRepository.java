package vn.io.naherb.product.repository;
import vn.io.naherb.product.entity.*;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.product.entity.ProductCategory;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {
    List<ProductCategory> findByStatusOrderByDisplayOrderAsc(ContentStatus status);
}
