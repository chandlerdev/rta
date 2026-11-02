package com.appointware.controller;

import com.appointware.common.ApiException;
import com.appointware.common.ApiResponse;
import com.appointware.entity.Admin;
import com.appointware.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/admins")
@RequiredArgsConstructor
public class AdminAdminController {

    private final AdminRepository repo;

    @GetMapping
    public ApiResponse<List<Admin>> list() { return ApiResponse.success(repo.findAll()); }

    @PostMapping("/login")
    public ApiResponse<List<Admin>> login(@RequestBody Admin in) {
        Admin a = repo.findByEmailAndPassword(in.getEmail(), in.getPassword())
                .orElseThrow(() -> ApiException.forbidden("Credential wrong"));
        return ApiResponse.success(List.of(a));
    }

    @PostMapping
    public ApiResponse<List<Admin>> create(@RequestBody Admin in) {
        return ApiResponse.success(List.of(repo.save(in)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<Admin>> update(@PathVariable Integer id, @RequestBody Admin in) {
        Admin a = repo.findById(id).orElseThrow(() -> ApiException.notFound("Admin not found"));
        if (in.getName() != null) a.setName(in.getName());
        if (in.getEmail() != null) a.setEmail(in.getEmail());
        if (in.getPassword() != null) a.setPassword(in.getPassword());
        return ApiResponse.success(List.of(repo.save(a)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        repo.deleteById(id);
        return ApiResponse.message(1, 200, "Admin deleted");
    }
}
