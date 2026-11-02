package com.appointware.repository;

import com.appointware.entity.ZcmsProcedureCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZcmsProcedureCategoryRepository extends JpaRepository<ZcmsProcedureCategory, Integer> {
    List<ZcmsProcedureCategory> findByIsDeleted(Integer isDeleted);
}
