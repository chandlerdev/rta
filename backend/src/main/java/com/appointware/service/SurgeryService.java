package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.SurgeryRequest;
import com.appointware.entity.AccountsSurgery;
import com.appointware.repository.AccountsSurgeryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SurgeryService {

    private final AccountsSurgeryRepository repo;

    public List<AccountsSurgery> list() {
        return repo.findByIsDeleted(0);
    }

    public List<AccountsSurgery> listByHospital(String hospitalId) {
        return repo.findByHospitalIdAndIsDeleted(hospitalId, 0);
    }

    public AccountsSurgery get(Integer id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Surgery not found"));
    }

    @Transactional
    public AccountsSurgery create(SurgeryRequest req) {
        AccountsSurgery s = AccountsSurgery.builder()
                .hospitalId(req.getHospitalId())
                .patientType(req.getPatientType())
                .procedureCategory(req.getProcedureCategory())
                .surgeryName(req.getSurgeryName())
                .procedureShortDescription(req.getProcedureShortDescription())
                .procedureDetailedDescription(req.getProcedureDetailedDescription())
                .procedureMedicationsInstructions(req.getProcedureMedicationsInstructions())
                .dosageGuidelines(req.getDosageGuidelines())
                .notesWarnings(req.getNotesWarnings())
                .medications(req.getMedications())
                .duration(req.getDuration())
                .dropOfTimeInAdvance(req.getDropOfTimeInAdvance())
                .procedureInstructionInBeforeDropOff(req.getProcedureInstructionInBeforeDropOff())
                .notificationTimeToAttenderAfterSurgeryCompleting(req.getNotificationTimeToAttenderAfterSurgeryCompleting())
                .status(req.getStatus() == null ? 1 : req.getStatus())
                .isDeleted(0)
                .build();
        return repo.save(s);
    }

    @Transactional
    public AccountsSurgery update(Integer id, SurgeryRequest req) {
        AccountsSurgery s = get(id);
        if (req.getHospitalId() != null) s.setHospitalId(req.getHospitalId());
        if (req.getPatientType() != null) s.setPatientType(req.getPatientType());
        if (req.getProcedureCategory() != null) s.setProcedureCategory(req.getProcedureCategory());
        if (req.getSurgeryName() != null) s.setSurgeryName(req.getSurgeryName());
        if (req.getProcedureShortDescription() != null) s.setProcedureShortDescription(req.getProcedureShortDescription());
        if (req.getProcedureDetailedDescription() != null) s.setProcedureDetailedDescription(req.getProcedureDetailedDescription());
        if (req.getProcedureMedicationsInstructions() != null) s.setProcedureMedicationsInstructions(req.getProcedureMedicationsInstructions());
        if (req.getDosageGuidelines() != null) s.setDosageGuidelines(req.getDosageGuidelines());
        if (req.getNotesWarnings() != null) s.setNotesWarnings(req.getNotesWarnings());
        if (req.getMedications() != null) s.setMedications(req.getMedications());
        if (req.getDuration() != null) s.setDuration(req.getDuration());
        if (req.getDropOfTimeInAdvance() != null) s.setDropOfTimeInAdvance(req.getDropOfTimeInAdvance());
        if (req.getProcedureInstructionInBeforeDropOff() != null) s.setProcedureInstructionInBeforeDropOff(req.getProcedureInstructionInBeforeDropOff());
        if (req.getNotificationTimeToAttenderAfterSurgeryCompleting() != null) s.setNotificationTimeToAttenderAfterSurgeryCompleting(req.getNotificationTimeToAttenderAfterSurgeryCompleting());
        if (req.getStatus() != null) s.setStatus(req.getStatus());
        return repo.save(s);
    }

    @Transactional
    public void delete(Integer id) {
        AccountsSurgery s = get(id);
        s.setIsDeleted(1);
        repo.save(s);
    }
}
