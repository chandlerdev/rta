package com.appointware.dto.request;

import lombok.Data;

@Data
public class SmsRequest {
    private String phone;
    private String region;
    private String content;
}
