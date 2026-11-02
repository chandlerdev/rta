package com.appointware.dto.response;

import com.appointware.entity.AccountsUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Integer id;
    private String userName;
    private String email;
    private String phone;
    private String isDoctor;
    private String isStaff;
    private String isActive;
    private Integer isDeleted;
    private String isSuperUser;
    private Integer planActive;
    private String planId;
    private String authExpDate;
    private String authExpFullDate;
    private String authRefId;
    private String authStartDate;
    private String authStartFullDate;
    private String authSubscriptionId;
    private LocalDateTime lastLogin;
    private String password;

    public static LoginResponse of(AccountsUser u) {
        return new LoginResponse(
                u.getId(), u.getUserName(), u.getEmail(), u.getPhone(),
                u.getIsDoctor(), u.getIsStaff(), u.getIsActive(), u.getIsDeleted(), u.getIsSuperuser(), u.getPlanActive(), u.getPlanId(),
                u.getAuthExpDate(),u.getAuthExpFullDate(),u.getAuthRefid(),u.getAuthStartDate(),u.getAuthStartFullDate(),u.getAuthSubscriptionid(),u.getLastLogin(),
                u.getPassword());
    }
}
