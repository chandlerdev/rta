package com.appointware.repository;

import com.appointware.entity.AccountsOperationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountsOperationAppointmentRepository extends JpaRepository<AccountsOperationAppointment, Integer> {
    List<AccountsOperationAppointment> findByHospital(Integer hospital);
    List<AccountsOperationAppointment> findByDoctor(String doctor);
    List<AccountsOperationAppointment> findByIsCompleted(Integer isCompleted);
    List<AccountsOperationAppointment> findByDate(String date);
}
