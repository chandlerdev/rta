package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.dto.request.AuthUpdateRequest;
import com.appointware.dto.request.ForgotPasswordRequest;
import com.appointware.dto.request.LoginRequest;
import com.appointware.dto.request.SetPasswordRequest;
import com.appointware.dto.response.LoginResponse;
import com.appointware.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<List<LoginResponse>> login(@Valid @RequestBody LoginRequest req) {
        return ApiResponse.success(List.of(authService.login(req)));
    }

    @PostMapping("/forgot-password")
    public ApiResponse<List<ApiResponse.Message>> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        return ApiResponse.message(1, 200, authService.forgotPassword(req));
    }

    @PostMapping("/set-password")
    public ApiResponse<List<ApiResponse.Message>> setPassword(@Valid @RequestBody SetPasswordRequest req) {
        return ApiResponse.message(1, 200, authService.setPassword(req));
    }

    /** PHP: open_email — verify a base64-encoded email for password reset flow. */
    @GetMapping("/open-email")
    public ApiResponse<List<Map<String, String>>> openEmail(@RequestParam String email) {
        return ApiResponse.success(List.of(Map.of("email", authService.openEmailByEmail(email))));
    }

    /** PHP: open_email_username — base64 user-id lookup. */
    @GetMapping("/open-user")
    public ApiResponse<List<Map<String, Object>>> openUser(@RequestParam String id) {
        var u = authService.openEmailByUsernameId(id);
        return ApiResponse.success(List.of(Map.of(
                "id", u.getId(),
                "user_name", u.getUserName(),
                "email", u.getEmail()
        )));
    }

    /** PHP: check_is_user — true if username or email already exists. */
    @GetMapping("/check-is-user")
    public ApiResponse<List<Map<String, Object>>> checkIsUser(@RequestParam(required = false) String userName,
                                                               @RequestParam(required = false) String phoneNumber) {
        return ApiResponse.success(List.of(authService.isUser(userName, phoneNumber)));
    }

    /** PHP: is_user_delete — soft delete a user. */
    @DeleteMapping("/users/{userId}")
    public ApiResponse<List<ApiResponse.Message>> softDelete(@PathVariable Integer userId) {
        authService.softDelete(userId);
        return ApiResponse.message(1, 200, "User deleted");
    }

    /**
     * PHP: authupdate - patch auth/subscription metadata on a user.
     * Accepts both snake_case (auth_refid, plan_active, ...) and camelCase
     * (authRefid, planActive, ...) via @JsonAlias on the DTO fields.
     * Also accepts PUT for clients that don't issue PATCH.
     */
    @RequestMapping(value = "/users/{userId}/auth", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ApiResponse<List<?>> updateAuth(@PathVariable Integer userId,
                                            @RequestBody AuthUpdateRequest req) {
        var u = authService.updateAuth(userId,
                req.getAuthRefid(),
                req.getAuthSubscriptionid(),
                req.getAuthStartDate(),
                req.getAuthStartFullDate(),
                req.getAuthExpDate(),
                req.getAuthExpFullDate(),
                req.getPlanActive(),
                req.getPlanId());
        return ApiResponse.success(List.of(u));
    }
}
