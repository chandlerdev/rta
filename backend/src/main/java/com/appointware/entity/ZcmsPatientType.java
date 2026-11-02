package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "zcms_patient_types")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ZcmsPatientType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "type_name", length = 250)
    private String typeName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
