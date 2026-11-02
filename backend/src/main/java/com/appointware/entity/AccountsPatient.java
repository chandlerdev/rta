package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts_patient")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsPatient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(columnDefinition = "TEXT")
    private String phone;

    @Column(length = 254)
    private String email;

    @Column(columnDefinition = "longtext")
    private String age;

    @Column(length = 1)
    private String gender;

    @Column(length = 255)
    private String purpose;
}
