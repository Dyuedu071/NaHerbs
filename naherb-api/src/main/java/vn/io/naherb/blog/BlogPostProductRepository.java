package vn.io.naherb.blog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BlogPostProductRepository extends JpaRepository<BlogPostProduct, UUID> {
    List<BlogPostProduct> findByPostId(UUID postId);
    void deleteByPostId(UUID postId);
    long countByPostId(UUID postId);
}
