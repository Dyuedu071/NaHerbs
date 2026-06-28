package vn.io.naherb.order;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.product.ProductSku;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sku_id")
    private ProductSku sku;

    @Column(name = "sku_name", nullable = false)
    private String skuName;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;
}
