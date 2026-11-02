package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.entity.ZcmsMailConfiguration;
import com.appointware.service.MailConfigurationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/mail-configurations")
@RequiredArgsConstructor
public class AdminMailConfigurationController {

    private final MailConfigurationService service;

    @GetMapping
    public ApiResponse<List<ZcmsMailConfiguration>> list() {
        return ApiResponse.success(service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<List<ZcmsMailConfiguration>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @PostMapping
    public ApiResponse<List<ZcmsMailConfiguration>> create(@RequestBody ZcmsMailConfiguration in) {
        return ApiResponse.success(List.of(service.save(in)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<ZcmsMailConfiguration>> update(@PathVariable Integer id,
                                                             @RequestBody ZcmsMailConfiguration in) {
        return ApiResponse.success(List.of(service.update(id, in)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Mail config deleted");
    }
}
