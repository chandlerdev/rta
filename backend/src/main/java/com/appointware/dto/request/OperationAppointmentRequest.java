package com.appointware.dto.request;

import lombok.Data;

@Data
public class OperationAppointmentRequest {
    private Integer id;
    private String surgeryName;
    private String surgeryDurationTime;
    private String doctor;
    private Integer hospital;
    private String patientName;
    private String phone;
    private String email;
    private String date;
    private String surgeryStartTime;
    private String surgeryDetails;
    private String attenderName;
    private String attenderPhoneNumber;
    private String dropOffTime;
    private String pharmacy;
    private String medicineNames;
    private String notifications;
    private String notificationTime;
    private Integer isAttender;
    private String procedureCategory;
    private String procedureShortDescription;
    private String procedureDetailedDescription;
    private String procedureMedicationsInstructions;
    private String dosageGuidelines;
    private String notesWarnings;
}
