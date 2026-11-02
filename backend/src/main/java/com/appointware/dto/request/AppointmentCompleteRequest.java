package com.appointware.dto.request;

import lombok.Data;

@Data
public class AppointmentCompleteRequest {
    private Integer appointmentId;
    private Integer doctorId;
    private Integer isCompleted;
    private String fromTime;
    private String toTime;
    private String feedback;
    private String intervel;
    private String smsIntervel;
    private Integer noSms;
    private String fromTimeBreak;
    private String toTimeBreak;
    private Integer isLunch;
}
