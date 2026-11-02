package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.entity.AccountsProfile;
import com.appointware.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/profiles")
@RequiredArgsConstructor
public class AdminProfileController {

    private final ProfileService service;

    @GetMapping
    public ApiResponse<List<AccountsProfile>> list() {
        return ApiResponse.success(service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<List<AccountsProfile>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @GetMapping("/by-user/{userId}")
    public ApiResponse<List<AccountsProfile>> getByUser(@PathVariable Integer userId) {
        return ApiResponse.success(List.of(service.getByUser(userId)));
    }

    @PostMapping
    public ApiResponse<List<AccountsProfile>> create(@RequestBody AccountsProfile in) {
        return ApiResponse.success(List.of(service.save(in)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<AccountsProfile>> update(@PathVariable Integer id, @RequestBody AccountsProfile in) {
        return ApiResponse.success(List.of(service.update(id, in)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Profile deleted");
    }
}
