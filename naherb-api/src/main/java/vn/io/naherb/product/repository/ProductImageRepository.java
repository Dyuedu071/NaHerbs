package vn.io.naherb.product.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.io.naherb.product.ProductImage;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    List<ProductImage> findByProductId(UUID productId);
    List<ProductImage> findByProductIdIn(List<UUID> productIds);

    /**
     * Fetch thumbnail images for a list of products in one query.
     * Returns Object[] { productId (UUID), url (String) } per row.
     */
    @Query("SELECT pi.product.id, pi.url FROM ProductImage pi WHERE pi.product.id IN :productIds AND pi.isThumbnail = true")
    List<Object[]> findThumbnailUrlsByProductIdIn(@Param("productIds") List<UUID> productIds);
}
