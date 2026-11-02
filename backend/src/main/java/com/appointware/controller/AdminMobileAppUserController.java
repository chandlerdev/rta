package com.appointware.controller;

import com.appointware.common.ApiException;
import com.appointware.common.ApiResponse;
import com.appointware.entity.MobileAppUser;
import com.appointware.repository.MobileAppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/mobile-users")
@RequiredArgsConstructor
public class AdminMobileAppUserController {

    private final MobileAppUserRepository repo;

    @GetMapping
    public ApiResponse<List<MobileAppUser>> list() { return ApiResponse.success(repo.findAll()); }

    @GetMapping("/{id}")
    public ApiResponse<List<MobileAppUser>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(repo.findById(id)
                .orElseThrow(() -> ApiException.notFound("Mobile user not found"))));
    }

    @PostMapping
    public ApiResponse<List<MobileAppUser>> create(@RequestBody MobileAppUser in) {
        return ApiResponse.success(List.of(repo.save(in)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<MobileAppUser>> update(@PathVariable Integer id, @RequestBody MobileAppUser in) {
        MobileAppUser u = repo.findById(id).orElseThrow(() -> ApiException.notFound("Mobile user not found"));
        if (in.getName() != null) u.setName(in.getName());
        if (in.getEmail() != null) u.setEmail(in.getEmail());
        if (in.getPassword() != null) u.setPassword(in.getPassword());
        return ApiResponse.success(List.of(repo.save(u)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        repo.deleteById(id);
        return ApiResponse.message(1, 200, "Mobile user deleted");
    }

    @PostMapping("/login")
    public ApiResponse<List<Map<String, Object>>> login(@RequestBody MobileAppUser in) {
        MobileAppUser u = repo.findByEmailAndPassword(in.getEmail(), in.getPassword())
                .orElseThrow(() -> ApiException.forbidden("Credential wrong"));
        return ApiResponse.success(List.of(Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail()
        )));
    }
}
