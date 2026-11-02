package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "zcms_state_lists")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ZcmsStateList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "state_name", length = 250)
    private String stateName;

    @Column(name = "state_code", length = 50)
    private String stateCode;

    @Column(name = "country_code", length = 50)
    private String countryCode;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
