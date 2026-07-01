package vn.io.naherb.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.io.naherb.common.enums.ContentStatus;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {
    Optional<BlogPost> findBySlug(String slug);
    boolean existsBySlug(String slug);
    
    @Query("SELECT b FROM BlogPost b WHERE b.status = :status")
    Page<BlogPost> findByStatus(@Param("status") ContentStatus status, Pageable pageable);

    @Query("SELECT b FROM BlogPost b WHERE b.category.id = :categoryId AND b.status = :status")
    Page<BlogPost> findByCategoryIdAndStatus(@Param("categoryId") UUID categoryId, @Param("status") ContentStatus status, Pageable pageable);

    Optional<BlogPost> findBySlugAndStatus(String slug, ContentStatus status);
    
    @Query("SELECT b FROM BlogPost b WHERE b.category.slug = :categorySlug AND b.status = :status")
    Page<BlogPost> findByCategorySlugAndStatus(@Param("categorySlug") String categorySlug, @Param("status") ContentStatus status, Pageable pageable);
}
