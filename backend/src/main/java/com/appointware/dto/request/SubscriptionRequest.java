package com.appointware.dto.request;

import lombok.Data;

@Data
public class SubscriptionRequest {
    private String userId;
    private String cardName;
    private String cardNumber;
    private String cardMonth;
    private String cardYear;
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String zip;
    private String country;
}
