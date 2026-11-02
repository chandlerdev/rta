package com.appointware.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalAppointmentsResponse {
    private Integer appointmentId;
    private String date;
    private String fromTime;
    private String toTime;
    private String reschduleTime;
    private Integer isCompleted;
    private Integer isShow;
    private Integer doctorId;
    private String doctorName;
    private Integer patientId;
    private String patientName;
    private String patientPhone;
    private String patientEmail;
}
