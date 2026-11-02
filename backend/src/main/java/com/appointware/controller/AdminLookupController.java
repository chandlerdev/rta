package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.entity.*;
import com.appointware.service.LookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Catch-all controller for the small reference tables:
 * procedure_categories, dosage_forms, drug_categories, patient_types,
 * state_lists, atob_menus.
 */
@RestController
@RequestMapping("/api/admin/lookups")
@RequiredArgsConstructor
public class AdminLookupController {

    private final LookupService service;

    // ---- Procedure categories ----
    @GetMapping("/procedure-categories")
    public ApiResponse<List<ZcmsProcedureCategory>> procedureCategories() {
        return ApiResponse.success(service.procedureCategories());
    }
    @PostMapping("/procedure-categories")
    public ApiResponse<List<ZcmsProcedureCategory>> createProcedureCategory(@RequestBody ZcmsProcedureCategory in) {
        return ApiResponse.success(List.of(service.saveProcedureCategory(in)));
    }
    @DeleteMapping("/procedure-categories/{id}")
    public ApiResponse<List<ApiResponse.Message>> deleteProcedureCategory(@PathVariable Integer id) {
        service.deleteProcedureCategory(id);
        return ApiResponse.message(1, 200, "Procedure category deleted");
    }

    // ---- Dosage forms ----
    @GetMapping("/dosage-forms")
    public ApiResponse<List<ZcmsDosageForm>> dosageForms() {
        return ApiResponse.success(service.dosageForms());
    }
    @PostMapping("/dosage-forms")
    public ApiResponse<List<ZcmsDosageForm>> createDosageForm(@RequestBody ZcmsDosageForm in) {
        return ApiResponse.success(List.of(service.saveDosageForm(in)));
    }
    @DeleteMapping("/dosage-forms/{id}")
    public ApiResponse<List<ApiResponse.Message>> deleteDosageForm(@PathVariable Integer id) {
        service.deleteDosageForm(id);
        return ApiResponse.message(1, 200, "Dosage form deleted");
    }

    // ---- Drug categories ----
    @GetMapping("/drug-categories")
    public ApiResponse<List<ZcmsDrugCategory>> drugCategories() {
        return ApiResponse.success(service.drugCategories());
    }
    @PostMapping("/drug-categories")
    public ApiResponse<List<ZcmsDrugCategory>> createDrugCategory(@RequestBody ZcmsDrugCategory in) {
        return ApiResponse.success(List.of(service.saveDrugCategory(in)));
    }
    @DeleteMapping("/drug-categories/{id}")
    public ApiResponse<List<ApiResponse.Message>> deleteDrugCategory(@PathVariable Integer id) {
        service.deleteDrugCategory(id);
        return ApiResponse.message(1, 200, "Drug category deleted");
    }

    // ---- Patient types ----
    @GetMapping("/patient-types")
    public ApiResponse<List<ZcmsPatientType>> patientTypes() {
        return ApiResponse.success(service.patientTypes());
    }
    @PostMapping("/patient-types")
    public ApiResponse<List<ZcmsPatientType>> createPatientType(@RequestBody ZcmsPatientType in) {
        return ApiResponse.success(List.of(service.savePatientType(in)));
    }
    @DeleteMapping("/patient-types/{id}")
    public ApiResponse<List<ApiResponse.Message>> deletePatientType(@PathVariable Integer id) {
        service.deletePatientType(id);
        return ApiResponse.message(1, 200, "Patient type deleted");
    }

    // ---- States ----
    @GetMapping("/states")
    public ApiResponse<List<ZcmsStateList>> states(@RequestParam(required = false) String countryCode) {
        return ApiResponse.success(countryCode == null ? service.states() : service.statesByCountry(countryCode));
    }
    @PostMapping("/states")
    public ApiResponse<List<ZcmsStateList>> createState(@RequestBody ZcmsStateList in) {
        return ApiResponse.success(List.of(service.saveState(in)));
    }
    @DeleteMapping("/states/{id}")
    public ApiResponse<List<ApiResponse.Message>> deleteState(@PathVariable Integer id) {
        service.deleteState(id);
        return ApiResponse.message(1, 200, "State deleted");
    }

    // ---- A-to-B menus (PHP: atobmenus) ----
    @GetMapping("/atob-menus")
    public ApiResponse<List<ZcmsAtobMenu>> menus(@RequestParam(required = false) String name) {
        return ApiResponse.success(service.menusByAlias(name));
    }
    @PostMapping("/atob-menus")
    public ApiResponse<List<ZcmsAtobMenu>> createMenu(@RequestBody ZcmsAtobMenu in) {
        return ApiResponse.success(List.of(service.saveMenu(in)));
    }
    @DeleteMapping("/atob-menus/{id}")
    public ApiResponse<List<ApiResponse.Message>> deleteMenu(@PathVariable Integer id) {
        service.deleteMenu(id);
        return ApiResponse.message(1, 200, "Menu deleted");
    }
}
