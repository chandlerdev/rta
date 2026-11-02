package com.appointware.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

/**
 * Body for PATCH /api/auth/users/{userId}/auth.
 *
 * The PHP frontend sends snake_case keys (`auth_refid`, `auth_subscriptionid`, ...),
 * while Spring Boot conventions are camelCase. @JsonAlias lets Jackson accept
 * either form for the same field.
 */
@Data
public class AuthUpdateRequest {

    @JsonAlias({"auth_refid"})
    private String authRefid;

    @JsonAlias({"auth_subscriptionid", "auth_subscription_id"})
    private String authSubscriptionid;

    @JsonAlias({"auth_start_date"})
    private String authStartDate;

    @JsonAlias({"auth_start_full_date"})
    private String authStartFullDate;

    @JsonAlias({"auth_exp_date"})
    private String authExpDate;

    @JsonAlias({"auth_exp_full_date"})
    private String authExpFullDate;

    @JsonAlias({"plan_active"})
    private Integer planActive;

    @JsonAlias({"plan_id"})
    private String planId;
}
