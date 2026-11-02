package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.entity.ZcmsMedication;
import com.appointware.repository.ZcmsMedicationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final ZcmsMedicationRepository repo;

    public List<ZcmsMedication> list() { return repo.findByIsDeleted(0); }
    public ZcmsMedication get(Integer id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Medication not found"));
    }

    @Transactional
    public ZcmsMedication save(ZcmsMedication m) {
        if (m.getIsDeleted() == null) m.setIsDeleted(0);
        if (m.getStatus() == null) m.setStatus(1);
        return repo.save(m);
    }

    @Transactional
    public ZcmsMedication update(Integer id, ZcmsMedication in) {
        ZcmsMedication m = get(id);
        if (in.getDrugName() != null) m.setDrugName(in.getDrugName());
        if (in.getCategoryId() != null) m.setCategoryId(in.getCategoryId());
        if (in.getDosageFormId() != null) m.setDosageFormId(in.getDosageFormId());
        if (in.getStrength() != null) m.setStrength(in.getStrength());
        if (in.getDescription() != null) m.setDescription(in.getDescription());
        if (in.getStatus() != null) m.setStatus(in.getStatus());
        return repo.save(m);
    }

    @Transactional
    public void delete(Integer id) {
        ZcmsMedication m = get(id);
        m.setIsDeleted(1);
        repo.save(m);
    }
}
