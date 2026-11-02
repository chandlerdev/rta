package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.entity.ZcmsMedication;
import com.appointware.service.MedicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/medications")
@RequiredArgsConstructor
public class AdminMedicationController {

    private final MedicationService service;

    @GetMapping
    public ApiResponse<List<ZcmsMedication>> list() {
        return ApiResponse.success(service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<List<ZcmsMedication>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @PostMapping
    public ApiResponse<List<ZcmsMedication>> create(@RequestBody ZcmsMedication in) {
        return ApiResponse.success(List.of(service.save(in)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<ZcmsMedication>> update(@PathVariable Integer id, @RequestBody ZcmsMedication in) {
        return ApiResponse.success(List.of(service.update(id, in)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Medication deleted");
    }
}
