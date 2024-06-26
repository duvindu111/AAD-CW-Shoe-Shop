package lk.ijse.gdse66.backend.entity;

import jakarta.persistence.*;
import lk.ijse.gdse66.backend.util.GenderEnum;
import lk.ijse.gdse66.backend.util.LoyaltyLevelEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Customer {

    @Id
    private String code;
    private String name;
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;
    private Date loyaltyJoinedDate;
    @Enumerated(EnumType.STRING)
    private LoyaltyLevelEnum loyaltyLevel;
    private Integer loyaltyPoints;
    private Date dob;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
    private String addressLine4;
    private String addressLine5;
    private String contact;
    private String email;
    private Timestamp recentPurchaseDate;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "customer")
    private List<Order> orders = new ArrayList<>();
}
