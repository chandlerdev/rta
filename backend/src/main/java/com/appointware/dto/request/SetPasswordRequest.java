package com.appointware.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SetPasswordRequest {
    /** Either id (base64-encoded) or email is provided */
    private String email;
    private Integer id;
    @NotBlank
    private String password;
}
