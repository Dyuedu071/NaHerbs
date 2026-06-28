package vn.io.naherb.cart;

import jakarta.persistence.*;
import lombok.*;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.product.ProductSku;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sku_id", nullable = false)
    private ProductSku sku;

    @Column(nullable = false)
    private Integer quantity = 1;
}
