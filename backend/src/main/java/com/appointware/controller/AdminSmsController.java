package com.appointware.controller;

import com.appointware.common.ApiException;
import com.appointware.common.ApiResponse;
import com.appointware.dto.request.SmsRequest;
import com.appointware.service.SmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/sms")
@RequiredArgsConstructor
public class AdminSmsController {

    private final SmsService smsService;

    /** PHP: open_otp / common_sms — send a 6-digit OTP. */
    @PostMapping("/otp")
    public ApiResponse<List<Map<String, String>>> sendOtp(@RequestBody SmsRequest req) {
        if (req.getPhone() == null || req.getRegion() == null) throw ApiException.badRequest("phone and region required");
        return ApiResponse.success(List.of(Map.of("otp", smsService.sendOtp(req.getRegion(), req.getPhone()))));
    }

    /** PHP: common_text — send arbitrary SMS body. */
    @PostMapping("/send")
    public ApiResponse<List<ApiResponse.Message>> sendText(@RequestBody SmsRequest req) {
        if (req.getPhone() == null || req.getRegion() == null) throw ApiException.badRequest("phone and region required");
        smsService.sendSms("+" + req.getRegion() + req.getPhone(), req.getContent());
        return ApiResponse.message(1, 200, "SMS dispatched");
    }
}
