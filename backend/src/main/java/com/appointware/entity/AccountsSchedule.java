package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts_schedule")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "doc_id_id")
    private Integer docIdId;

    @Column(name = "patient_id_id")
    private Integer patientIdId;
}
