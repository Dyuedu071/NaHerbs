package vn.io.naherb.lead;

import jakarta.persistence.*;
import lombok.*;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.common.enums.LeadSource;
import vn.io.naherb.common.enums.LeadStatus;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Lead extends BaseEntity {

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(length = 254)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false)
    private LeadSource source = LeadSource.CONTACT_FORM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadStatus status = LeadStatus.NEW;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
