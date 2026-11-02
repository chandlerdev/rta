package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.DoctorTemplateRequest;
import com.appointware.entity.DoctorTemplate;
import com.appointware.repository.DoctorTemplateRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorTemplateService {

    private final DoctorTemplateRepository repo;

    public List<DoctorTemplate> list() { return repo.findAll(); }

    public DoctorTemplate get(Integer id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Template not found"));
    }

    public Optional<DoctorTemplate> getByDoctor(Integer doctorId) {
        return repo.findByDoctorId(doctorId);
    }

    @Transactional
    public DoctorTemplate save(DoctorTemplateRequest req) {
        DoctorTemplate t = repo.findByDoctorId(req.getDoctorId())
                .orElseGet(() -> DoctorTemplate.builder()
                        .doctorId(req.getDoctorId())
                        .status(1)
                        .isDeleted(0)
                        .build());
        if (req.getAdvanceSmsTemplate() != null) t.setAdvanceSmsTemplate(req.getAdvanceSmsTemplate());
        if (req.getRescheduleSmsTemplate() != null) t.setRescheduleSmsTemplate(req.getRescheduleSmsTemplate());
        if (req.getStatus() != null) t.setStatus(req.getStatus());
        return repo.save(t);
    }

    @Transactional
    public void delete(Integer id) {
        DoctorTemplate t = get(id);
        t.setIsDeleted(1);
        repo.save(t);
    }
}
