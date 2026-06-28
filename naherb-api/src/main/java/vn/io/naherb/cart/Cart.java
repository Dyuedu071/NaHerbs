package vn.io.naherb.cart;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.account.Account;

@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cart extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", unique = true)
    private Account account;

    @Column(name = "session_id", unique = true, length = 100)
    private String sessionId;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    public Cart(Account account) {
        this.account = account;
        this.totalAmount = BigDecimal.ZERO;
    }
}
