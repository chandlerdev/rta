package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.entity.AccountsOperationSms;
import com.appointware.service.OperationSmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/operation-sms")
@RequiredArgsConstructor
public class AdminOperationSmsController {

    private final OperationSmsService service;

    @GetMapping
    public ApiResponse<List<AccountsOperationSms>> list() {
        return ApiResponse.success(service.list());
    }

    @PostMapping
    public ApiResponse<List<AccountsOperationSms>> create(@RequestBody AccountsOperationSms in) {
        return ApiResponse.success(List.of(service.save(in)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<AccountsOperationSms>> update(@PathVariable Integer id, @RequestBody AccountsOperationSms in) {
        in.setId(id);
        return ApiResponse.success(List.of(service.save(in)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Operation SMS deleted");
    }

    /** Manually trigger the cron-like dispatcher (otherwise runs every minute). */
    @PostMapping("/dispatch")
    public ApiResponse<List<ApiResponse.Message>> dispatch() {
        service.dispatchDueMessages();
        return ApiResponse.message(1, 200, "Dispatched");
    }
}
