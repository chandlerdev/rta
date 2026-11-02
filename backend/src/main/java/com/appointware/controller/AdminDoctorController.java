package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.dto.request.DoctorRequest;
import com.appointware.entity.AccountsDoctor;
import com.appointware.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/doctors")
@RequiredArgsConstructor
public class AdminDoctorController {

    private final DoctorService service;

    @GetMapping
    public ApiResponse<List<AccountsDoctor>> list(@RequestParam(required = false) Integer hospitalId) {
        return ApiResponse.success(hospitalId == null ? service.list() : service.listByHospital(hospitalId));
    }

    @GetMapping("/{id}")
    public ApiResponse<List<AccountsDoctor>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @PostMapping
    public ApiResponse<List<AccountsDoctor>> create(@RequestBody DoctorRequest req) {
        return ApiResponse.success(List.of(service.create(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<AccountsDoctor>> update(@PathVariable Integer id, @RequestBody DoctorRequest req) {
        return ApiResponse.success(List.of(service.update(id, req)));
    }

    @PatchMapping("/{id}/active")
    public ApiResponse<List<ApiResponse.Message>> blockUnblock(@PathVariable Integer id,
                                                                @RequestParam Integer isActive) {
        service.blockUnblock(id, isActive);
        return ApiResponse.message(1, 200, "Status updated");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Doctor deleted");
    }

    /** PHP: check_is_hospital_doctor */
    @GetMapping("/exists")
    public ApiResponse<List<Map<String, Boolean>>> exists(@RequestParam Integer hospitalId,
                                                          @RequestParam String userName) {
        return ApiResponse.success(List.of(Map.of("exists", service.exists(hospitalId, userName))));
    }
}
