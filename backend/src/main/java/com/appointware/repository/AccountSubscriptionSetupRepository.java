package com.appointware.repository;

import com.appointware.entity.AccountSubscriptionSetup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountSubscriptionSetupRepository extends JpaRepository<AccountSubscriptionSetup, Integer> {
    List<AccountSubscriptionSetup> findByIsDeleted(Integer isDeleted);
    List<AccountSubscriptionSetup> findByStatusAndIsDeleted(Integer status, Integer isDeleted);
}
