package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.dto.request.SurgeryRequest;
import com.appointware.entity.AccountsSurgery;
import com.appointware.service.SurgeryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/surgeries")
@RequiredArgsConstructor
public class AdminSurgeryController {

    private final SurgeryService service;

    @GetMapping
    public ApiResponse<List<AccountsSurgery>> list(@RequestParam(required = false) String hospitalId) {
        return ApiResponse.success(hospitalId == null ? service.list() : service.listByHospital(hospitalId));
    }

    @GetMapping("/{id}")
    public ApiResponse<List<AccountsSurgery>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @PostMapping
    public ApiResponse<List<AccountsSurgery>> create(@RequestBody SurgeryRequest req) {
        return ApiResponse.success(List.of(service.create(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<AccountsSurgery>> update(@PathVariable Integer id, @RequestBody SurgeryRequest req) {
        return ApiResponse.success(List.of(service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Surgery deleted");
    }
}
