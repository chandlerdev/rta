package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts_pharmacys")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsPharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pharmacy_name", columnDefinition = "TEXT")
    private String pharmacyName;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 250)
    private String phone;

    @Column(length = 250)
    private String email;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
