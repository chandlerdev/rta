package com.appointware.repository;

import com.appointware.entity.ZcmsAtobMenu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZcmsAtobMenuRepository extends JpaRepository<ZcmsAtobMenu, Integer> {
    List<ZcmsAtobMenu> findByAliasNameContainingIgnoreCase(String aliasName);
    List<ZcmsAtobMenu> findByIsDeleted(Integer isDeleted);
}
