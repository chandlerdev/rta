package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@DynamicUpdate
@Entity
@Table(name = "accounts_user")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_name", length = 250, nullable = false)
    private String userName;

    @Column(length = 128, nullable = false)
    private String password;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "is_superuser", columnDefinition = "longtext")
    @Builder.Default
    private String isSuperuser = "0";

    @Column(length = 250)
    private String email;

    @Column(length = 250)
    private String phone;

    @Column(name = "is_staff", columnDefinition = "longtext")
    @Builder.Default
    private String isStaff = "0";

    @Column(name = "is_active", columnDefinition = "longtext")
    @Builder.Default
    private String isActive = "1";

    @Column(name = "is_doctor", columnDefinition = "longtext")
    @Builder.Default
    private String isDoctor = "0";

    @Column(name = "is_deleted")
    @Builder.Default
    private Integer isDeleted = 0;

    // The legacy schema declares these as VARCHAR(250) NOT NULL with no DEFAULT,
    // so they MUST have a non-null value at INSERT time. Defaulting to "" via
    // field initialiser (covers `new AccountsUser()`) and @Builder.Default
    // (covers builder usage) keeps INSERTs valid even when the create flow
    // doesn't explicitly set them.
    @Column(name = "auth_refid", length = 250)
    @Builder.Default
    private String authRefid = "";

    @Column(name = "auth_subscriptionid", length = 250)
    @Builder.Default
    private String authSubscriptionid = "";

    @Column(name = "auth_start_date", length = 250)
    @Builder.Default
    private String authStartDate = "";

    @Column(name = "auth_start_full_date", length = 250)
    @Builder.Default
    private String authStartFullDate = "";

    @Column(name = "auth_exp_date", length = 250)
    @Builder.Default
    private String authExpDate = "";

    @Column(name = "auth_exp_full_date", length = 250)
    @Builder.Default
    private String authExpFullDate = "";

    @Column(name = "plan_active")
    @Builder.Default
    private Integer planActive = 0;

    @Column(name = "plan_id", length = 250)
    @Builder.Default
    private String planId = "";
}
