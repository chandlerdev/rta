package com.appointware.repository;

import com.appointware.entity.AccountSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountSubscriptionRepository extends JpaRepository<AccountSubscription, Integer> {
    List<AccountSubscription> findByUserId(String userId);
}
