package com.appointware.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class HospitalRequest {
    private String name;
    private String phone;
    private String regNo;
    private String img;
    private String email;
    private String specility;
    private String street;
    private String landmark;
    private String city;
    private String state;
    private String zip;
    private Integer userId;
    private String userName;
    private String password;
    private Integer isActive;

    /**
     * Optional. Stored on accounts_user.plan_id. Empty string when omitted.
     * Accepts snake_case "plan_id" too via @JsonAlias.
     */
    @JsonAlias({"plan_id"})
    private String planId;
}
