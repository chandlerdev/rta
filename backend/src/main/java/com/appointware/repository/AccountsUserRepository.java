package com.appointware.repository;

import com.appointware.entity.AccountsUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountsUserRepository extends JpaRepository<AccountsUser, Integer> {
    Optional<AccountsUser> findByUserNameAndPasswordAndIsActive(String userName, String password, String isActive);
    Optional<AccountsUser> findByUserName(String userName);
    Optional<AccountsUser> findByEmailAndIsActiveAndIsDeleted(String email, String isActive, Integer isDeleted);
    Optional<AccountsUser> findByEmail(String email);
    List<AccountsUser> findByIsDeleted(Integer isDeleted);
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
