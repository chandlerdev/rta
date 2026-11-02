package com.appointware.repository;

import com.appointware.entity.AccountsProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountsProfileRepository extends JpaRepository<AccountsProfile, Integer> {
    Optional<AccountsProfile> findByUserId(Integer userId);
}
