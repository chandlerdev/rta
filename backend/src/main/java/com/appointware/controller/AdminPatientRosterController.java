package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.entity.ZcmsPatientRoster;
import com.appointware.service.PatientRosterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/patient-rosters")
@RequiredArgsConstructor
public class AdminPatientRosterController {

    private final PatientRosterService service;

    @GetMapping
    public ApiResponse<List<ZcmsPatientRoster>> list(@RequestParam(required = false) String hospitalId) {
        return ApiResponse.success(hospitalId == null ? service.list() : service.listByHospital(hospitalId));
    }

    /**
     * GET /api/admin/patient-rosters/{hospitalId}
     * Returns every roster row belonging to that hospital. The path value is
     * the value stored in zcms_patient_rosters.hospital_id (a string column),
     * NOT the row's own primary key.
     */
    @GetMapping("/{hospitalId}")
    public ApiResponse<List<ZcmsPatientRoster>> byHospital(@PathVariable String hospitalId) {
        return ApiResponse.success(service.listByHospital(hospitalId));
    }

    /**
     * GET /api/admin/patient-rosters/by-id/{id}
     * Looks up a single roster row by its primary key. Use this when you
     * actually need one record, not a hospital-wide list.
     */
    @GetMapping("/by-id/{id}")
    public ApiResponse<List<ZcmsPatientRoster>> getById(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @PostMapping
    public ApiResponse<List<ZcmsPatientRoster>> create(@RequestBody ZcmsPatientRoster in) {
        return ApiResponse.success(List.of(service.save(in)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<ZcmsPatientRoster>> update(@PathVariable Integer id, @RequestBody ZcmsPatientRoster in) {
        return ApiResponse.success(List.of(service.update(id, in)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Roster deleted");
    }
}
