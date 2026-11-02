package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts_appointment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 250)
    private String date;

    @Column(name = "from_time", length = 8)
    private String fromTime;

    @Column(name = "tod_time", length = 250)
    private String todTime;

    @Column(name = "to_time", length = 36)
    private String toTime;

    // Legacy schema: NOT NULL with no DB default. Default to "" so inserts
    // that don't set these (e.g. import) don't violate the constraint.
    @Column(name = "reschdule_time", length = 250)
    @Builder.Default
    private String reschduleTime = "";

    @Column(name = "is_completed")
    private Integer isCompleted;

    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String feedback = "";

    @Column(length = 250)
    private String delay;

    @Column(name = "doc_id_id")
    private Integer docIdId;

    @Column(name = "patient_id_id")
    private Integer patientIdId;

    @Column(name = "is_show")
    @Builder.Default
    private Integer isShow = 0;

    @Column(name = "is_sms")
    @Builder.Default
    private Integer isSms = 0;

    @Column(name = "cus_date", length = 250)
    private String cusDate;

    @Column(name = "appointment_type", length = 250)
    private String appointmentType;
}
