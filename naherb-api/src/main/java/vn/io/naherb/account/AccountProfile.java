package vn.io.naherb.account;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.io.naherb.common.entity.BaseEntity;

@Entity
@Table(name = "account_profiles")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AccountProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    @Column(name = "full_name")
    private String fullName;

    @Column(length = 30)
    private String phone;

    @Column(name = "contact_email", length = 254)
    private String contactEmail;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;
}
