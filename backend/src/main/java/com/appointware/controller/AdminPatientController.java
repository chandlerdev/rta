package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.dto.request.PatientRequest;
import com.appointware.entity.AccountsAppointment;
import com.appointware.entity.AccountsPatient;
import com.appointware.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/patients")
@RequiredArgsConstructor
public class AdminPatientController {

    private final PatientService service;

    @GetMapping
    public ApiResponse<List<AccountsPatient>> list() {
        return ApiResponse.success(service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<List<AccountsPatient>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @PostMapping
    public ApiResponse<List<AccountsPatient>> create(@RequestBody PatientRequest req) {
        return ApiResponse.success(List.of(service.create(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<AccountsPatient>> update(@PathVariable Integer id, @RequestBody PatientRequest req) {
        return ApiResponse.success(List.of(service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Patient deleted");
    }

    /** Create patient + 1:1 appointment in a single call (PHP: add_custom_patient). */
    @PostMapping("/with-appointment")
    public ApiResponse<List<AccountsAppointment>> withAppointment(@RequestBody PatientRequest req) {
        return ApiResponse.success(List.of(service.createWithAppointment(req)));
    }

    /** Dynamic flavour (PHP: add_custom_patient_dynamic). */
    @PostMapping("/with-dynamic-appointment")
    public ApiResponse<List<AccountsAppointment>> withDynamicAppointment(@RequestBody PatientRequest req) {
        return ApiResponse.success(List.of(service.createWithDynamicAppointment(req)));
    }
}
