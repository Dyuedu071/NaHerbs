package vn.io.naherb.order;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.io.naherb.common.enums.OrderStatus;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    List<OrderItem> findByOrder_IdOrderByCreatedAtAsc(UUID orderId);

    @Query("""
            select sku.product.id, coalesce(sum(item.quantity), 0)
            from OrderItem item
            join item.sku sku
            join item.order orderEntity
            where sku.product.id in :productIds
              and orderEntity.status <> :cancelledStatus
            group by sku.product.id
            """)
    List<Object[]> sumSoldQuantityByProductId(
            @Param("productIds") List<UUID> productIds,
            @Param("cancelledStatus") OrderStatus cancelledStatus);
}
