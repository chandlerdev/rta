package com.appointware.repository;

import com.appointware.entity.AccountsPatient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountsPatientRepository extends JpaRepository<AccountsPatient, Integer> {
    List<AccountsPatient> findByPhone(String phone);
    List<AccountsPatient> findByEmail(String email);
}
