package com.appointware.repository;

import com.appointware.entity.AccountsPharmacy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountsPharmacyRepository extends JpaRepository<AccountsPharmacy, Integer> {
    List<AccountsPharmacy> findByIsDeleted(Integer isDeleted);
}
