package com.appointware.dto.request;

import lombok.Data;

@Data
public class DoctorTemplateRequest {
    private Integer doctorId;
    private String advanceSmsTemplate;
    private String rescheduleSmsTemplate;
    private Integer status;
}
