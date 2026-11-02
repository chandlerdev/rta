package com.appointware.repository;

import com.appointware.entity.AccountsOperationSms;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountsOperationSmsRepository extends JpaRepository<AccountsOperationSms, Integer> {
    List<AccountsOperationSms> findBySmsTimeAndSmsSentAndIsDeleted(String smsTime, Integer smsSent, Integer isDeleted);
    List<AccountsOperationSms> findByAppId(String appId);
}
