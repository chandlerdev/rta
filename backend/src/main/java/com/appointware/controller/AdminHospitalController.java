package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.dto.request.HospitalRequest;
import com.appointware.entity.AccountsHospital;
import com.appointware.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hospitals")
@RequiredArgsConstructor
public class AdminHospitalController {

    private final HospitalService service;

    @GetMapping
    public ApiResponse<List<AccountsHospital>> list() {
        return ApiResponse.success(service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<List<AccountsHospital>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @PostMapping
    public ApiResponse<List<AccountsHospital>> create(@RequestBody HospitalRequest req) {
        return ApiResponse.success(List.of(service.create(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<AccountsHospital>> update(@PathVariable Integer id, @RequestBody HospitalRequest req) {
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
        return ApiResponse.message(1, 200, "Hospital deleted");
    }
}
