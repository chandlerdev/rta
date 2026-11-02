package com.appointware.repository;

import com.appointware.entity.ZcmsDrugCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZcmsDrugCategoryRepository extends JpaRepository<ZcmsDrugCategory, Integer> {
    List<ZcmsDrugCategory> findByIsDeleted(Integer isDeleted);
}
