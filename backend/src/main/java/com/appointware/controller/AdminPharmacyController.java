package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.dto.request.PharmacyRequest;
import com.appointware.entity.AccountsPharmacy;
import com.appointware.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pharmacies")
@RequiredArgsConstructor
public class AdminPharmacyController {

    private final PharmacyService service;

    @GetMapping
    public ApiResponse<List<AccountsPharmacy>> list() {
        return ApiResponse.success(service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<List<AccountsPharmacy>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @PostMapping
    public ApiResponse<List<AccountsPharmacy>> create(@RequestBody PharmacyRequest req) {
        return ApiResponse.success(List.of(service.create(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<AccountsPharmacy>> update(@PathVariable Integer id, @RequestBody PharmacyRequest req) {
        return ApiResponse.success(List.of(service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Pharmacy deleted");
    }
}
