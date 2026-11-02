package com.appointware.dto.request;

import lombok.Data;

@Data
public class SurgeryRequest {
    private String hospitalId;
    private String patientType;
    private String procedureCategory;
    private String surgeryName;
    private String procedureShortDescription;
    private String procedureDetailedDescription;
    private String procedureMedicationsInstructions;
    private String dosageGuidelines;
    private String notesWarnings;
    private String medications;
    private String duration;
    private String dropOfTimeInAdvance;
    private String procedureInstructionInBeforeDropOff;
    private String notificationTimeToAttenderAfterSurgeryCompleting;
    private Integer status;
}
