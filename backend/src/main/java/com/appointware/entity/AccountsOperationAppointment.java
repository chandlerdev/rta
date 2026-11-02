package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts_operation_appointments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsOperationAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "procedure_category", length = 250)
    private String procedureCategory;

    @Column(name = "surgery_name", columnDefinition = "TEXT")
    private String surgeryName;

    @Column(name = "surgery_duration_time", length = 250)
    private String surgeryDurationTime;

    @Column(name = "hospital")
    private Integer hospital;

    @Column(length = 250)
    private String doctor;

    @Column(name = "patient_name", length = 250)
    private String patientName;

    @Column(length = 250)
    private String phone;

    @Column(length = 250)
    private String email;

    @Column(length = 250)
    private String date;

    @Column(name = "surgery_start_time", length = 250)
    private String surgeryStartTime;

    @Column(name = "surgery_details", columnDefinition = "TEXT")
    private String surgeryDetails;

    @Column(name = "attender_name", length = 250)
    private String attenderName;

    @Column(name = "attender_phone_number", length = 250)
    private String attenderPhoneNumber;

    @Column(name = "drop_off_time", length = 250)
    private String dropOffTime;

    @Column(columnDefinition = "TEXT")
    private String pharmacy;

    @Column(name = "medicine_names", columnDefinition = "TEXT")
    private String medicineNames;

    @Column(length = 250)
    private String notifications;

    @Column(name = "notification_time", length = 250)
    private String notificationTime;

    @Column(name = "is_attender")
    private Integer isAttender;

    @Column(name = "is_completed")
    private Integer isCompleted = 0;

    @Column(name = "completed_time", length = 250)
    private String completedTime;

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
}
