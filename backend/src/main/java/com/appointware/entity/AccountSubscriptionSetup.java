package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "account_subscriptions_setup")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountSubscriptionSetup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String title1;

    @Column(columnDefinition = "TEXT")
    private String title2;

    @Column(columnDefinition = "TEXT")
    private String price;

    @Column(name = "price_title", columnDefinition = "TEXT")
    private String priceTitle;

    @Column(columnDefinition = "TEXT")
    private String button1;

    @Column(columnDefinition = "TEXT")
    private String description1;

    @Column(columnDefinition = "TEXT")
    private String button2;

    @Column(columnDefinition = "TEXT")
    private String description2;

    @Column(name = "description2_number", columnDefinition = "TEXT")
    private String description2Number;

    @Column(columnDefinition = "TEXT")
    private String description3;

    @Column(name = "ios_identifier", columnDefinition = "TEXT")
    private String iosIdentifier;

    @Column
    private Integer status = 0;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
