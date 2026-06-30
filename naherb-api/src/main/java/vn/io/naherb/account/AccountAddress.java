package vn.io.naherb.account;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.io.naherb.common.entity.BaseEntity;

@Entity
@Table(name = "account_addresses")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AccountAddress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "receiver_name", nullable = false)
    private String receiverName;

    @Column(name = "receiver_phone", nullable = false, length = 30)
    private String receiverPhone;

    @Column(name = "receiver_email", length = 254)
    private String receiverEmail;

    @Column(name = "province_name", nullable = false)
    private String provinceName;

    @Column(name = "ward_name", nullable = false)
    private String wardName;

    @Column(name = "address_line", nullable = false, columnDefinition = "TEXT")
    private String addressLine;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    public AccountAddress(
            Account account,
            String receiverName,
            String receiverPhone,
            String receiverEmail,
            String provinceName,
            String wardName,
            String addressLine,
            String note,
            boolean isDefault) {
        this.account = account;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.receiverEmail = receiverEmail;
        this.provinceName = provinceName;
        this.wardName = wardName;
        this.addressLine = addressLine;
        this.note = note;
        this.isDefault = isDefault;
    }
}
