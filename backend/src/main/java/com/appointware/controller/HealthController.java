package com.appointware.controller;

import com.appointware.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<List<Map<String, String>>> health() {
        return ApiResponse.success(List.of(Map.of("status", "ok", "app", "Appointware")));
    }

    /** PHP: ip — return the caller's IP. */
    @GetMapping("/ip")
    public ApiResponse<List<Map<String, String>>> ip(HttpServletRequest req) {
        String ip = req.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) ip = req.getRemoteAddr();
        return ApiResponse.success(List.of(Map.of("ip", ip)));
    }
}
