package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "zcms_dosage_forms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ZcmsDosageForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "form_name", length = 250)
    private String formName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
