package com.appointware.repository;

import com.appointware.entity.ZcmsDosageForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZcmsDosageFormRepository extends JpaRepository<ZcmsDosageForm, Integer> {
    List<ZcmsDosageForm> findByIsDeleted(Integer isDeleted);
}
