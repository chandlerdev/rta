package com.appointware.repository;

import com.appointware.entity.ZcmsMedication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZcmsMedicationRepository extends JpaRepository<ZcmsMedication, Integer> {
    List<ZcmsMedication> findByIsDeleted(Integer isDeleted);
    List<ZcmsMedication> findByCategoryId(Integer categoryId);
}
