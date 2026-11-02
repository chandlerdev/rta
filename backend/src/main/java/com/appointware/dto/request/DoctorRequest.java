package com.appointware.dto.request;

import lombok.Data;

@Data
public class DoctorRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String gender;
    private String img;
    private String specility;
    private String address;
    private String city;
    private String state;
    private String zipcode;
    private String timeZone;
    private String fromTime;
    private String toTime;
    private String consultTime;
    private String intervel;
    private String smsIntervel;
    private String smsCount;
    private String fromTimeBreak;
    private String toTimeBreak;
    private String checkInTime;
    private String checkOutTime;
    private String experience;
    private String licence;
    private String joinedDate;
    private Integer hospitalIdId;
    private Integer userId;
    private String userName;
    private String password;
    private String email;
    private Integer isActive;
    private Integer isLunch;
    private String timeType;
    private String googleLink;
    private String facebookLink;
}
