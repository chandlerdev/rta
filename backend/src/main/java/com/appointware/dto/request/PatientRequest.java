package com.appointware.dto.request;

import lombok.Data;

@Data
public class PatientRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String age;
    private String gender;
    private String purpose;
    private String date;
    private String fromTime;
    private String todTime;
    private Integer doctorId;
    private String appointmentType;
}
