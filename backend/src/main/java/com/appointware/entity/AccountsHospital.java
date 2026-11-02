package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

@DynamicUpdate
@Entity
@Table(name = "accounts_hospital")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsHospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(length = 255)
    private String phone;

    @Column(name = "reg_no", length = 50)
    private String regNo;

    @Column(length = 100)
    private String img;

    @Column(length = 254)
    private String email;

    @Column(length = 100)
    private String specility;

    @Column(length = 100)
    private String street;

    @Column(length = 100)
    private String landmark;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 250)
    private String zip;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "is_active")
    private Integer isActive = 0;

    /**
     * Not persisted - the username lives on accounts_user. The hospital
     * service joins it in before returning so list/get responses include
     * "userName" alongside the entity's stored columns.
     */
    @Transient
    private String userName;
}
