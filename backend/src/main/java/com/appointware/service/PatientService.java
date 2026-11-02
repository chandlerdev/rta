package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.PatientRequest;
import com.appointware.entity.AccountsAppointment;
import com.appointware.entity.AccountsPatient;
import com.appointware.repository.AccountsAppointmentRepository;
import com.appointware.repository.AccountsPatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final AccountsPatientRepository patientRepo;
    private final AccountsAppointmentRepository appointmentRepo;

    public List<AccountsPatient> list() {
        return patientRepo.findAll();
    }

    public AccountsPatient get(Integer id) {
        return patientRepo.findById(id)
                .orElseThrow(() -> ApiException.notFound("Patient not found"));
    }

    @Transactional
    public AccountsPatient create(PatientRequest req) {
        AccountsPatient p = AccountsPatient.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .phone(req.getPhone())
                .email(req.getEmail())
                .age(req.getAge() == null ? "" : req.getAge())
                .gender(req.getGender() == null ? "" : req.getGender())
                .purpose(req.getPurpose() == null ? "" : req.getPurpose())
                .build();
        return patientRepo.save(p);
    }

    @Transactional
    public AccountsPatient update(Integer id, PatientRequest req) {
        AccountsPatient p = get(id);
        if (req.getFirstName() != null) p.setFirstName(req.getFirstName());
        if (req.getLastName() != null) p.setLastName(req.getLastName());
        if (req.getPhone() != null) p.setPhone(req.getPhone());
        if (req.getEmail() != null) p.setEmail(req.getEmail());
        if (req.getAge() != null) p.setAge(req.getAge());
        if (req.getGender() != null) p.setGender(req.getGender());
        if (req.getPurpose() != null) p.setPurpose(req.getPurpose());
        return patientRepo.save(p);
    }

    @Transactional
    public void delete(Integer id) {
        get(id);
        patientRepo.deleteById(id);
    }

    /** Static (1:1 slot) patient + appointment in one go. */
    @Transactional
    public AccountsAppointment createWithAppointment(PatientRequest req) {
        if (req.getDoctorId() == null || req.getDate() == null || req.getFromTime() == null) {
            throw ApiException.badRequest("doctorId, date and fromTime are required");
        }
        var existing = appointmentRepo.findByDocIdIdAndDateAndFromTime(
                req.getDoctorId(), req.getDate(), req.getFromTime());
        if (!existing.isEmpty()) {
            throw ApiException.badRequest("Slot already booked");
        }
        AccountsPatient p = create(req);
        AccountsAppointment a = AccountsAppointment.builder()
                .date(req.getDate())
                .fromTime(req.getFromTime())
                .todTime(req.getTodTime())
                .toTime("")
                .isCompleted(0)
                .delay("00:10:00")
                .docIdId(req.getDoctorId())
                .patientIdId(p.getId())
                .cusDate(toCusDate(req.getDate()))
                .appointmentType(req.getAppointmentType() == null ? "" : req.getAppointmentType())
                .build();
        return appointmentRepo.save(a);
    }

    /** Dynamic (no pre-allocated slot) patient. */
    @Transactional
    public AccountsAppointment createWithDynamicAppointment(PatientRequest req) {
        AccountsPatient p = create(req);
        AccountsAppointment a = AccountsAppointment.builder()
                .date(req.getDate())
                .fromTime(req.getFromTime())
                .todTime(req.getTodTime() == null ? "" : req.getTodTime())
                .toTime("")
                .isCompleted(0)
                .delay("00:00:00")
                .docIdId(req.getDoctorId())
                .patientIdId(p.getId())
                .cusDate(req.getDate() == null ? "" : toCusDate(req.getDate()))
                .appointmentType("Dynamic")
                .build();
        return appointmentRepo.save(a);
    }

    private static String toCusDate(String mmddyyyy) {
        if (mmddyyyy == null) return "";
        String[] parts = mmddyyyy.split("-");
        if (parts.length != 3) return mmddyyyy;
        return parts[2] + "-" + parts[0] + "-" + parts[1];
    }
}
