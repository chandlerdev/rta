package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mobile_app_users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MobileAppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 250)
    private String name;

    @Column(length = 250)
    private String email;

    @Column(length = 250)
    private String password;
}
