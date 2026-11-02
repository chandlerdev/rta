package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "zcms_mail_configuration")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ZcmsMailConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 250)
    private String host;

    @Column(length = 250)
    private String port;

    @Column(length = 250)
    private String email;

    @Column(length = 250)
    private String password;

    @Column(name = "mail_from", length = 250)
    private String mailFrom;

    @Column(name = "from_name", length = 250)
    private String fromName;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
