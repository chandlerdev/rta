package com.appointware.repository;

import com.appointware.entity.ZcmsStateList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZcmsStateListRepository extends JpaRepository<ZcmsStateList, Integer> {
    List<ZcmsStateList> findByIsDeleted(Integer isDeleted);
    List<ZcmsStateList> findByCountryCode(String countryCode);
}
