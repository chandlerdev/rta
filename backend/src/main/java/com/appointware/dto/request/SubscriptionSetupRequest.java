package com.appointware.dto.request;

import lombok.Data;

@Data
public class SubscriptionSetupRequest {
    private String title1;
    private String title2;
    private String price;
    private String priceTitle;
    private String button1;
    private String description1;
    private String button2;
    private String description2;
    private String description2Number;
    private String description3;
    private String iosIdentifier;
    private Integer status;
}
