package com.appointware.repository;

import com.appointware.entity.ZcmsPatientType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZcmsPatientTypeRepository extends JpaRepository<ZcmsPatientType, Integer> {
    List<ZcmsPatientType> findByIsDeleted(Integer isDeleted);
}
