package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.service.ImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/import")
@RequiredArgsConstructor
public class AdminImportController {

    private final ImportService importService;

    /** PHP: import_patient */
    @PostMapping(value = "/patient", consumes = "multipart/form-data")
    public ApiResponse<List<Map<String, Object>>> importStatic(@RequestParam("file") MultipartFile file) {
        return ApiResponse.success(List.of(importService.importStatic(file)));
    }

    /** PHP: import_patient_dynamic */
    @PostMapping(value = "/patient-dynamic", consumes = "multipart/form-data")
    public ApiResponse<List<Map<String, Object>>> importDynamic(@RequestParam("file") MultipartFile file) {
        return ApiResponse.success(List.of(importService.importDynamic(file)));
    }
}
