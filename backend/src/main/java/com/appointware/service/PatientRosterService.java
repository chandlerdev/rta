package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.entity.ZcmsPatientRoster;
import com.appointware.repository.ZcmsPatientRosterRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientRosterService {

    private final ZcmsPatientRosterRepository repo;

    public List<ZcmsPatientRoster> list() { return repo.findByIsDeleted(0); }
    public List<ZcmsPatientRoster> listByHospital(String hospitalId) {
        return repo.findByHospitalIdAndIsDeleted(hospitalId, 0);
    }
    public ZcmsPatientRoster get(Integer id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Roster not found"));
    }

    @Transactional
    public ZcmsPatientRoster save(ZcmsPatientRoster in) {
        if (in.getIsDeleted() == null) in.setIsDeleted(0);
        if (in.getStatus() == null) in.setStatus(1);
        return repo.save(in);
    }

    @Transactional
    public ZcmsPatientRoster update(Integer id, ZcmsPatientRoster in) {
        ZcmsPatientRoster r = get(id);
        if (in.getHospital() != null) r.setHospital(in.getHospital());
        if (in.getFirstName() != null) r.setFirstName(in.getFirstName());
        if (in.getLastName() != null) r.setLastName(in.getLastName());
        if (in.getPhone() != null) r.setPhone(in.getPhone());
        if (in.getEmail() != null) r.setEmail(in.getEmail());
        if (in.getAddress1() != null) r.setAddress1(in.getAddress1());
        if (in.getAddress2() != null) r.setAddress2(in.getAddress2());
        if (in.getCity() != null) r.setCity(in.getCity());
        if (in.getState() != null) r.setState(in.getState());
        if (in.getZip() != null) r.setZip(in.getZip());
        if (in.getAttenderName() != null) r.setAttenderName(in.getAttenderName());
        if (in.getAttenderPhone() != null) r.setAttenderPhone(in.getAttenderPhone());
        if (in.getPatientType() != null) r.setPatientType(in.getPatientType());
        if (in.getAddress() != null) r.setAddress(in.getAddress());
        if (in.getHospitalId() != null) r.setHospitalId(in.getHospitalId());
        if (in.getStatus() != null) r.setStatus(in.getStatus());
        return repo.save(r);
    }

    @Transactional
    public void delete(Integer id) {
        ZcmsPatientRoster r = get(id);
        r.setIsDeleted(1);
        repo.save(r);
    }
}
