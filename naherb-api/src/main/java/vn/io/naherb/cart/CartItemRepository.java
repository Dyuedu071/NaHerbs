package vn.io.naherb.cart;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    List<CartItem> findByCart_IdOrderByCreatedAtAsc(UUID cartId);

    Optional<CartItem> findByCart_IdAndSku_Id(UUID cartId, UUID skuId);

    Optional<CartItem> findByIdAndCart_Account_Id(UUID id, UUID accountId);

    void deleteByCart_Id(UUID cartId);
}
