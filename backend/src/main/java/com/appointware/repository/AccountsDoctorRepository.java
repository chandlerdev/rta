package com.appointware.repository;

import com.appointware.entity.AccountsDoctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountsDoctorRepository extends JpaRepository<AccountsDoctor, Integer> {
    Optional<AccountsDoctor> findByUserId(Integer userId);
    List<AccountsDoctor> findByHospitalIdId(Integer hospitalId);
    List<AccountsDoctor> findByHospitalIdIdAndIsDeleted(Integer hospitalId, Integer isDeleted);
    List<AccountsDoctor> findByIsActive(Integer isActive);
    List<AccountsDoctor> findByIsDeleted(Integer isDeleted);

    /** Used by cron_today_doctor_patient_sms - active, not-deleted doctors. */
    List<AccountsDoctor> findByIsActiveAndIsDeleted(Integer isActive, Integer isDeleted);
}
