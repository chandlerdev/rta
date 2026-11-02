package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "zcms_atob_menus")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ZcmsAtobMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "menu_name", length = 250)
    private String menuName;

    @Column(name = "alias_name", length = 250)
    private String aliasName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
