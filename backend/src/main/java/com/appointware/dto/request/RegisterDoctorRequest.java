package com.appointware.dto.request;

import lombok.Data;

@Data
public class RegisterDoctorRequest {
    private String userName;
    private String password;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private String gender;
    private String specility;
    private String address;
    private String city;
    private String state;
    private String zipcode;
    private String timeZone;
    private String consultTime;
    private String intervel;
    private String smsIntervel;
    private String smsCount;
    private String fromTime;
    private String toTime;
    private String fromTimeBreak;
    private String toTimeBreak;
    private String experience;
    private String licence;
    private Integer hospitalIdId;
    private Integer isLunch;
    private String timeType;
}
