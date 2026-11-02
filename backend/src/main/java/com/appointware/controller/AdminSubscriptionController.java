package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.dto.request.SubscriptionRequest;
import com.appointware.dto.request.SubscriptionSetupRequest;
import com.appointware.entity.AccountSubscription;
import com.appointware.entity.AccountSubscriptionSetup;
import com.appointware.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subscriptions")
@RequiredArgsConstructor
public class AdminSubscriptionController {

    private final SubscriptionService service;

    // -------- User subscriptions --------

    @GetMapping
    public ApiResponse<List<AccountSubscription>> list(@RequestParam(required = false) String userId) {
        return ApiResponse.success(userId == null ? service.list() : service.listByUser(userId));
    }

    @GetMapping("/{id}")
    public ApiResponse<List<AccountSubscription>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    @PostMapping
    public ApiResponse<List<AccountSubscription>> create(@RequestBody SubscriptionRequest req) {
        return ApiResponse.success(List.of(service.create(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<List<AccountSubscription>> update(@PathVariable Integer id, @RequestBody SubscriptionRequest req) {
        return ApiResponse.success(List.of(service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Subscription deleted");
    }

    // -------- Plan setup --------

    @GetMapping("/plans")
    public ApiResponse<List<AccountSubscriptionSetup>> plans() {
        return ApiResponse.success(service.listPlans());
    }

    @GetMapping("/plans/{id}")
    public ApiResponse<List<AccountSubscriptionSetup>> getPlan(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.getPlan(id)));
    }

    @PostMapping("/plans")
    public ApiResponse<List<AccountSubscriptionSetup>> createPlan(@RequestBody SubscriptionSetupRequest req) {
        return ApiResponse.success(List.of(service.createPlan(req)));
    }

    @PutMapping("/plans/{id}")
    public ApiResponse<List<AccountSubscriptionSetup>> updatePlan(@PathVariable Integer id,
                                                                    @RequestBody SubscriptionSetupRequest req) {
        return ApiResponse.success(List.of(service.updatePlan(id, req)));
    }

    @DeleteMapping("/plans/{id}")
    public ApiResponse<List<ApiResponse.Message>> deletePlan(@PathVariable Integer id) {
        service.deletePlan(id);
        return ApiResponse.message(1, 200, "Plan deleted");
    }
}
