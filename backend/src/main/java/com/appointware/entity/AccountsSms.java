package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts_sms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsSms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255)
    private String message;

    @Column(name = "appointment_id_id")
    private Integer appointmentIdId;

    @Column(name = "hospital_id_id")
    private Integer hospitalIdId;
}
