package com.appointware.repository;

import com.appointware.entity.AccountsSurgery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountsSurgeryRepository extends JpaRepository<AccountsSurgery, Integer> {
    List<AccountsSurgery> findByHospitalIdAndIsDeleted(String hospitalId, Integer isDeleted);
    List<AccountsSurgery> findByIsDeleted(Integer isDeleted);
}
