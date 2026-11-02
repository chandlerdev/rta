package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor_template")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DoctorTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "doctor_id")
    private Integer doctorId;

    @Column(name = "advance_sms_template", columnDefinition = "longtext")
    private String advanceSmsTemplate;

    @Column(name = "reschedule_sms_template", columnDefinition = "longtext")
    private String rescheduleSmsTemplate;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
