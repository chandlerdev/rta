package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "account_subscriptions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", length = 250)
    private String userId;

    @Column(name = "card_name", length = 250)
    private String cardName;

    @Column(name = "card_number", length = 250)
    private String cardNumber;

    @Column(name = "card_month", length = 250)
    private String cardMonth;

    @Column(name = "card_year", length = 250)
    private String cardYear;

    @Column(columnDefinition = "TEXT")
    private String address1;

    @Column(columnDefinition = "TEXT")
    private String address2;

    @Column(length = 250)
    private String city;

    @Column(length = 250)
    private String state;

    @Column(length = 250)
    private String zip;

    @Column(length = 250)
    private String country;
}
