package vn.io.naherb.product;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.io.naherb.common.enums.ContentStatus;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByStatusOrderByDisplayOrderAscCreatedAtDesc(ContentStatus status);

    Optional<Product> findBySlugAndStatus(String slug, ContentStatus status);
}
