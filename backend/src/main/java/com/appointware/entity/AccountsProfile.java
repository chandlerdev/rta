package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "accounts_profile")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(length = 255)
    private String phone;

    @Column(length = 100)
    private String img;

    @Column(nullable = false)
    private LocalDateTime joined;

    @Column(name = "user_id")
    private Integer userId;
}
