package com.appointware.dto.request;

import lombok.Data;

@Data
public class PharmacyRequest {
    private String pharmacyName;
    private String address;
    private String phone;
    private String email;
    private Integer status;
}
