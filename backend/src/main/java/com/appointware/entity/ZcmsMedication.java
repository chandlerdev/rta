package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "zcms_medications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ZcmsMedication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "drug_name", length = 250)
    private String drugName;

    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "dosage_form_id")
    private Integer dosageFormId;

    @Column(columnDefinition = "TEXT")
    private String strength;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
