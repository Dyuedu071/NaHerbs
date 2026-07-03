package vn.io.naherb.product.repository;
import vn.io.naherb.product.entity.*;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.product.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlugAndStatus(String slug, ContentStatus status);
    boolean existsBySlug(String slug);
}
