package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.ForgotPasswordRequest;
import com.appointware.dto.request.LoginRequest;
import com.appointware.dto.request.SetPasswordRequest;
import com.appointware.dto.response.LoginResponse;
import com.appointware.entity.AccountsUser;
import com.appointware.repository.AccountsUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountsUserRepository userRepo;
    private final MailService mailService;

    @Value("${app.reset-password-url:}")
    private String resetPasswordUrl;

    /** Plaintext login — 1:1 with PHP behavior. */
    public LoginResponse login(LoginRequest req) {
        AccountsUser u = userRepo
                .findByUserNameAndPasswordAndIsActive(req.getUserName(), req.getPassword(), "1")
                .orElseThrow(() -> ApiException.forbidden("Credential wrong"));
        u.setLastLogin(LocalDateTime.now());
        userRepo.save(u);
        return LoginResponse.of(u);
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest req) {
        AccountsUser u;
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            u = userRepo.findByEmailAndIsActiveAndIsDeleted(req.getEmail(), "1", 0)
                    .orElseThrow(() -> ApiException.forbidden("No email found"));
        } else if (req.getUsername() != null && !req.getUsername().isBlank()) {
            u = userRepo.findByUserName(req.getUsername())
                    .orElseThrow(() -> ApiException.forbidden("No username found"));
        } else {
            throw ApiException.badRequest("Email or username required");
        }

        String encodedEmail = Base64.getEncoder().encodeToString(u.getEmail().getBytes(StandardCharsets.UTF_8));
        String encodedId = Base64.getEncoder().encodeToString(String.valueOf(u.getId()).getBytes(StandardCharsets.UTF_8));
        String link = (resetPasswordUrl == null || resetPasswordUrl.isBlank())
                ? "/reset_password/" + encodedId
                : resetPasswordUrl + "/" + encodedId;

        String html = """
                <p>You're receiving this email because you requested a password reset.</p>
                <p>Please go to the following page and choose a new password:</p>
                <p><a href="%s">%s</a></p>
                <p>Your username, in case you've forgotten: %s</p>
                <p>Thanks for using RealtimeWare!</p>
                <p>encoded_email: %s</p>
                """.formatted(link, link, u.getUserName(), encodedEmail);

        mailService.sendHtml(u.getEmail(), "Reset Password", html);
        return "Email sent successfully";
    }

    @Transactional
    public String setPassword(SetPasswordRequest req) {
        AccountsUser u;
        if (req.getId() != null) {
            u = userRepo.findById(req.getId())
                    .orElseThrow(() -> ApiException.notFound("User not found"));
        } else if (req.getEmail() != null && !req.getEmail().isBlank()) {
            u = userRepo.findByEmail(req.getEmail())
                    .orElseThrow(() -> ApiException.notFound("User not found"));
        } else {
            throw ApiException.badRequest("id or email required");
        }
        u.setPassword(req.getPassword());
        userRepo.save(u);
        return "Password updated";
    }

    public String openEmailByEmail(String emailBase64) {
        String email = decode(emailBase64);
        userRepo.findByEmail(email).orElseThrow(() -> ApiException.notFound("No email found"));
        return email;
    }

    public AccountsUser openEmailByUsernameId(String idBase64) {
        Integer id = Integer.valueOf(decode(idBase64));
        return userRepo.findById(id).orElseThrow(() -> ApiException.notFound("No user found"));
    }

    /**
     * PHP: check_is_user — reports which of username / phone already exist,
     * along with a human-readable message per duplicate.
     */
    public Map<String, Object> isUser(String userName, String phoneNumber) {
        boolean nameExists = userName != null && !userName.isBlank() && userRepo.existsByUserName(userName);
        boolean phoneExists = phoneNumber != null && !phoneNumber.isBlank() && userRepo.existsByPhone(phoneNumber);

        List<String> messages = new ArrayList<>();
        if (nameExists) messages.add("Name is already exist");
        if (phoneExists) messages.add("Phone number is already exist");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("exists", nameExists || phoneExists);
        result.put("userName", nameExists);
        result.put("phoneNumber", phoneExists);
        result.put("messages", messages);
        return result;
    }


    @Transactional
    public void softDelete(Integer userId) {
        AccountsUser u = userRepo.findById(userId).orElseThrow(() -> ApiException.notFound("User not found"));
        u.setIsDeleted(1);
        u.setIsActive("0");
        userRepo.save(u);
    }

    @Transactional
    public AccountsUser updateAuth(Integer id, String authRefid, String authSubscriptionid,
                                   String authStartDate, String authStartFullDate,
                                   String authExpDate, String authExpFullDate,
                                   Integer planActive, String planId) {
        AccountsUser u = userRepo.findById(id).orElseThrow(() -> ApiException.notFound("User not found"));
        if (authRefid != null) u.setAuthRefid(authRefid);
        if (authSubscriptionid != null) u.setAuthSubscriptionid(authSubscriptionid);
        if (authStartDate != null) u.setAuthStartDate(authStartDate);
        if (authStartFullDate != null) u.setAuthStartFullDate(authStartFullDate);
        if (authExpDate != null) u.setAuthExpDate(authExpDate);
        if (authExpFullDate != null) u.setAuthExpFullDate(authExpFullDate);
        if (planActive != null) u.setPlanActive(planActive);
        if (planId != null) u.setPlanId(planId);
        return userRepo.save(u);
    }

    private String decode(String base64) {
        try {
            return new String(Base64.getDecoder().decode(base64), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw ApiException.badRequest("Invalid token");
        }
    }
}
