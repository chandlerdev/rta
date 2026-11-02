package com.appointware.repository;

import com.appointware.entity.MobileAppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MobileAppUserRepository extends JpaRepository<MobileAppUser, Integer> {
    Optional<MobileAppUser> findByEmailAndPassword(String email, String password);
    Optional<MobileAppUser> findByEmail(String email);
}
