package com.appointware.controller;

import com.appointware.common.ApiException;
import com.appointware.common.ApiResponse;
import com.appointware.dto.request.DoctorTemplateRequest;
import com.appointware.entity.DoctorTemplate;
import com.appointware.service.DoctorTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctor-templates")
@RequiredArgsConstructor
public class AdminDoctorTemplateController {

    private final DoctorTemplateService service;

    @GetMapping
    public ApiResponse<List<DoctorTemplate>> list() {
        return ApiResponse.success(service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<List<DoctorTemplate>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @GetMapping("/by-doctor/{doctorId}")
    public ApiResponse<List<DoctorTemplate>> getByDoctor(@PathVariable Integer doctorId) {
        return ApiResponse.success(List.of(service.getByDoctor(doctorId)
                .orElseThrow(() -> ApiException.notFound("Template not found"))));
    }

    @PostMapping
    public ApiResponse<List<DoctorTemplate>> save(@RequestBody DoctorTemplateRequest req) {
        return ApiResponse.success(List.of(service.save(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<DoctorTemplate>> update(@PathVariable Integer id, @RequestBody DoctorTemplateRequest req) {
        if (req.getDoctorId() == null) throw ApiException.badRequest("doctorId required");
        return ApiResponse.success(List.of(service.save(req)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Template deleted");
    }
}
