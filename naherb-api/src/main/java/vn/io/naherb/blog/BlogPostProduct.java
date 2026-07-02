package vn.io.naherb.blog;

import jakarta.persistence.*;
import lombok.*;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.product.Product;

@Entity
@Table(name = "blog_post_products")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BlogPostProduct extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_post_id", nullable = false)
    private BlogPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
