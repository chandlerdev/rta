package com.appointware.service;

import com.appointware.entity.AccountsOperationSms;
import com.appointware.repository.AccountsOperationSmsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Mirrors dynamic/cron.php — every minute, drain accounts_operation_sms rows whose
 * sms_time equals "now" (rounded to the minute) and dispatch them via Twilio.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OperationSmsService {

    private final AccountsOperationSmsRepository repo;
    private final SmsService smsService;

    public List<AccountsOperationSms> list() {
        return repo.findAll();
    }

    @Transactional
    public AccountsOperationSms save(AccountsOperationSms in) {
        return repo.save(in);
    }

    @Transactional
    public void delete(Integer id) {
        repo.deleteById(id);
    }

    @Scheduled(cron = "0 * * * * *") // every minute on the second-zero
    @Transactional
    public void dispatchDueMessages() {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:00"));
        List<AccountsOperationSms> due = repo.findBySmsTimeAndSmsSentAndIsDeleted(now, 0, 0);
        for (AccountsOperationSms s : due) {
            try {
                smsService.sendSms(s.getPhone(), s.getSmsContent());
                s.setSmsSent(1);
                repo.save(s);
            } catch (Exception e) {
                log.error("Failed to dispatch operation SMS {}: {}", s.getId(), e.getMessage());
            }
        }
    }
}
