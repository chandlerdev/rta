package com.appointware.repository;

import com.appointware.entity.DoctorTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorTemplateRepository extends JpaRepository<DoctorTemplate, Integer> {
    Optional<DoctorTemplate> findByDoctorId(Integer doctorId);
}
