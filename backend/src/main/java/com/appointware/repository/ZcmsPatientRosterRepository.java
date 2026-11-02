package com.appointware.repository;

import com.appointware.entity.ZcmsPatientRoster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZcmsPatientRosterRepository extends JpaRepository<ZcmsPatientRoster, Integer> {
    List<ZcmsPatientRoster> findByHospitalIdAndIsDeleted(String hospitalId, Integer isDeleted);
    List<ZcmsPatientRoster> findByIsDeleted(Integer isDeleted);
}
