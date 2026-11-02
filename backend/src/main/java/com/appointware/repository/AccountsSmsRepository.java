package com.appointware.repository;

import com.appointware.entity.AccountsSms;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountsSmsRepository extends JpaRepository<AccountsSms, Integer> {
    List<AccountsSms> findByAppointmentIdId(Integer appointmentIdId);
    List<AccountsSms> findByHospitalIdId(Integer hospitalIdId);
}
