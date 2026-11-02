package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts_surgerys")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsSurgery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "hospital_id", length = 250)
    private String hospitalId;

    @Column(name = "patient_type", length = 250)
    private String patientType;

    @Column(name = "procedure_category", columnDefinition = "TEXT")
    private String procedureCategory;

    @Column(name = "surgery_name", columnDefinition = "TEXT")
    private String surgeryName;

    @Column(name = "procedure_short_description", columnDefinition = "TEXT")
    private String procedureShortDescription;

    @Column(name = "procedure_detailed_description", columnDefinition = "TEXT")
    private String procedureDetailedDescription;

    @Column(name = "procedure_medications_instructions", columnDefinition = "TEXT")
    private String procedureMedicationsInstructions;

    @Column(name = "dosage_guidelines", columnDefinition = "TEXT")
    private String dosageGuidelines;

    @Column(name = "notes_warnings", columnDefinition = "TEXT")
    private String notesWarnings;

    @Column(columnDefinition = "TEXT")
    private String medications;

    @Column(length = 250)
    private String duration;

    @Column(name = "drop_of_time_in_advance", length = 250)
    private String dropOfTimeInAdvance;

    @Column(name = "procedure_instruction_in_before_drop_off", columnDefinition = "TEXT")
    private String procedureInstructionInBeforeDropOff;

    @Column(name = "notification_time_to_attender_after_surgery_completing", length = 250)
    private String notificationTimeToAttenderAfterSurgeryCompleting;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
