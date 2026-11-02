package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.OperationAppointmentRequest;
import com.appointware.dto.request.OperationCompleteRequest;
import com.appointware.entity.AccountsOperationAppointment;
import com.appointware.repository.AccountsOperationAppointmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OperationAppointmentService {

    private final AccountsOperationAppointmentRepository repo;
    private final SmsService smsService;

    public List<AccountsOperationAppointment> list() {
        return repo.findAll();
    }

    public AccountsOperationAppointment get(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> ApiException.notFound("Operation appointment not found"));
    }

    public List<AccountsOperationAppointment> getByHospital(Integer hospitalId) {
        return repo.findByHospital(hospitalId);
    }

    public List<AccountsOperationAppointment> getByDoctor(String doctor) {
        return repo.findByDoctor(doctor);
    }

    @Transactional
    public AccountsOperationAppointment save(OperationAppointmentRequest req) {
        AccountsOperationAppointment a;
        if (req.getId() != null) {
            a = get(req.getId());
        } else {
            a = new AccountsOperationAppointment();
            a.setIsCompleted(0);
        }
        a.setSurgeryName(req.getSurgeryName());
        a.setSurgeryDurationTime(req.getSurgeryDurationTime());
        a.setDoctor(req.getDoctor());
        a.setHospital(req.getHospital());
        a.setPatientName(req.getPatientName());
        a.setPhone(req.getPhone());
        a.setEmail(req.getEmail());
        a.setDate(req.getDate());
        a.setSurgeryStartTime(req.getSurgeryStartTime());
        a.setSurgeryDetails(req.getSurgeryDetails());
        a.setAttenderName(req.getAttenderName());
        a.setAttenderPhoneNumber(req.getAttenderPhoneNumber());
        a.setDropOffTime(req.getDropOffTime());
        a.setPharmacy(req.getPharmacy());
        a.setMedicineNames(req.getMedicineNames());
        a.setNotifications(req.getNotifications());
        a.setNotificationTime(req.getNotificationTime());
        a.setIsAttender(req.getIsAttender());
        a.setProcedureCategory(req.getProcedureCategory());
        a.setProcedureShortDescription(req.getProcedureShortDescription());
        a.setProcedureDetailedDescription(req.getProcedureDetailedDescription());
        a.setProcedureMedicationsInstructions(req.getProcedureMedicationsInstructions());
        a.setDosageGuidelines(req.getDosageGuidelines());
        a.setNotesWarnings(req.getNotesWarnings());
        return repo.save(a);
    }

    @Transactional
    public AccountsOperationAppointment complete(OperationCompleteRequest req) {
        AccountsOperationAppointment a = get(req.getId());
        a.setIsCompleted(1);
        a.setCompletedTime(req.getCompletedTime() == null
                ? LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                : req.getCompletedTime());
        repo.save(a);

        if (req.getPhone() != null && !req.getPhone().isBlank()
                && req.getAttenderContent() != null && !req.getAttenderContent().isBlank()) {
            smsService.sendSms(req.getPhone(), req.getAttenderContent());
        }
        return a;
    }

    @Transactional
    public void delete(Integer id) {
        get(id);
        repo.deleteById(id);
    }
}
