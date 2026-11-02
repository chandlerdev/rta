package com.appointware.dto.request;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
    private String username;
}
