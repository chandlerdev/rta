package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "zcms_drug_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ZcmsDrugCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "category_name", length = 250)
    private String categoryName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
