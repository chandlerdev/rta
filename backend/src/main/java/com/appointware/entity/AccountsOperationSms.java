package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts_operation_sms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsOperationSms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "app_id", length = 250)
    private String appId;

    @Column(length = 250)
    private String phone;

    @Column(name = "sms_content", columnDefinition = "TEXT")
    private String smsContent;

    @Column(name = "sms_time", length = 250)
    private String smsTime;

    @Column(name = "sms_sent")
    private Integer smsSent = 0;

    @Column(length = 250)
    private String type;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
