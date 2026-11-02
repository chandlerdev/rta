package com.appointware.service;

import com.appointware.entity.*;
import com.appointware.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Shared CRUD for small reference tables (procedure category, dosage form,
 * drug category, patient type, state list, atob menu).
 */
@Service
@RequiredArgsConstructor
public class LookupService {

    private final ZcmsProcedureCategoryRepository procedureRepo;
    private final ZcmsDosageFormRepository dosageRepo;
    private final ZcmsDrugCategoryRepository drugRepo;
    private final ZcmsPatientTypeRepository patientTypeRepo;
    private final ZcmsStateListRepository stateRepo;
    private final ZcmsAtobMenuRepository menuRepo;

    public List<ZcmsProcedureCategory> procedureCategories() { return procedureRepo.findByIsDeleted(0); }
    @Transactional public ZcmsProcedureCategory saveProcedureCategory(ZcmsProcedureCategory in) {
        if (in.getIsDeleted() == null) in.setIsDeleted(0);
        if (in.getStatus() == null) in.setStatus(1);
        return procedureRepo.save(in);
    }
    @Transactional public void deleteProcedureCategory(Integer id) {
        procedureRepo.findById(id).ifPresent(x -> { x.setIsDeleted(1); procedureRepo.save(x); });
    }

    public List<ZcmsDosageForm> dosageForms() { return dosageRepo.findByIsDeleted(0); }
    @Transactional public ZcmsDosageForm saveDosageForm(ZcmsDosageForm in) {
        if (in.getIsDeleted() == null) in.setIsDeleted(0);
        if (in.getStatus() == null) in.setStatus(1);
        return dosageRepo.save(in);
    }
    @Transactional public void deleteDosageForm(Integer id) {
        dosageRepo.findById(id).ifPresent(x -> { x.setIsDeleted(1); dosageRepo.save(x); });
    }

    public List<ZcmsDrugCategory> drugCategories() { return drugRepo.findByIsDeleted(0); }
    @Transactional public ZcmsDrugCategory saveDrugCategory(ZcmsDrugCategory in) {
        if (in.getIsDeleted() == null) in.setIsDeleted(0);
        if (in.getStatus() == null) in.setStatus(1);
        return drugRepo.save(in);
    }
    @Transactional public void deleteDrugCategory(Integer id) {
        drugRepo.findById(id).ifPresent(x -> { x.setIsDeleted(1); drugRepo.save(x); });
    }

    public List<ZcmsPatientType> patientTypes() { return patientTypeRepo.findByIsDeleted(0); }
    @Transactional public ZcmsPatientType savePatientType(ZcmsPatientType in) {
        if (in.getIsDeleted() == null) in.setIsDeleted(0);
        if (in.getStatus() == null) in.setStatus(1);
        return patientTypeRepo.save(in);
    }
    @Transactional public void deletePatientType(Integer id) {
        patientTypeRepo.findById(id).ifPresent(x -> { x.setIsDeleted(1); patientTypeRepo.save(x); });
    }

    public List<ZcmsStateList> states() { return stateRepo.findByIsDeleted(0); }
    public List<ZcmsStateList> statesByCountry(String code) { return stateRepo.findByCountryCode(code); }
    @Transactional public ZcmsStateList saveState(ZcmsStateList in) {
        if (in.getIsDeleted() == null) in.setIsDeleted(0);
        if (in.getStatus() == null) in.setStatus(1);
        return stateRepo.save(in);
    }
    @Transactional public void deleteState(Integer id) {
        stateRepo.findById(id).ifPresent(x -> { x.setIsDeleted(1); stateRepo.save(x); });
    }

    public List<ZcmsAtobMenu> menus() { return menuRepo.findByIsDeleted(0); }
    public List<ZcmsAtobMenu> menusByAlias(String alias) {
        if (alias == null || alias.isBlank()) return menuRepo.findByIsDeleted(0);
        return menuRepo.findByAliasNameContainingIgnoreCase(alias);
    }
    @Transactional public ZcmsAtobMenu saveMenu(ZcmsAtobMenu in) {
        if (in.getIsDeleted() == null) in.setIsDeleted(0);
        if (in.getStatus() == null) in.setStatus(1);
        return menuRepo.save(in);
    }
    @Transactional public void deleteMenu(Integer id) {
        menuRepo.findById(id).ifPresent(x -> { x.setIsDeleted(1); menuRepo.save(x); });
    }
}
