package com.appointware.repository;

import com.appointware.entity.AccountsHospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountsHospitalRepository extends JpaRepository<AccountsHospital, Integer> {
    Optional<AccountsHospital> findByUserId(Integer userId);
    List<AccountsHospital> findByIsActive(Integer isActive);
    List<AccountsHospital> findByNameContainingIgnoreCase(String name);
}
