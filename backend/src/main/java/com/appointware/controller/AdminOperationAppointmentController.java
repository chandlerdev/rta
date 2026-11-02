package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.dto.request.OperationAppointmentRequest;
import com.appointware.dto.request.OperationCompleteRequest;
import com.appointware.entity.AccountsOperationAppointment;
import com.appointware.service.OperationAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/operation-appointments")
@RequiredArgsConstructor
public class AdminOperationAppointmentController {

    private final OperationAppointmentService service;

    @GetMapping
    public ApiResponse<List<AccountsOperationAppointment>> list(@RequestParam(required = false) Integer hospitalId,
                                                                  @RequestParam(required = false) String doctor) {
        if (hospitalId != null) return ApiResponse.success(service.getByHospital(hospitalId));
        if (doctor != null) return ApiResponse.success(service.getByDoctor(doctor));
        return ApiResponse.success(service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<List<AccountsOperationAppointment>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    /** PHP: add_edit_operation_appointment */
    @PostMapping
    public ApiResponse<List<AccountsOperationAppointment>> create(@RequestBody OperationAppointmentRequest req) {
        req.setId(null);
        return ApiResponse.success(List.of(service.save(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<AccountsOperationAppointment>> update(@PathVariable Integer id,
                                                                   @RequestBody OperationAppointmentRequest req) {
        req.setId(id);
        return ApiResponse.success(List.of(service.save(req)));
    }

    /** PHP: complete_operation_appointment */
    @PostMapping("/{id}/complete")
    public ApiResponse<List<AccountsOperationAppointment>> complete(@PathVariable Integer id,
                                                                     @RequestBody OperationCompleteRequest req) {
        req.setId(id);
        return ApiResponse.success(List.of(service.complete(req)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Operation appointment deleted");
    }
}
