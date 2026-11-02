package com.appointware.service;

import com.appointware.config.TwilioProperties;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsService {

    private final TwilioProperties twilio;

    public void sendSms(String toPhone, String body) {
        if (toPhone == null || toPhone.isBlank()) {
            log.warn("sendSms skipped: missing phone");
            return;
        }
        if (!twilio.isConfigured()) {
            log.info("[SMS-STUB] to={} body={}", toPhone, body);
            return;
        }
        try {
            Message.creator(
                    new PhoneNumber(toPhone),
                    new PhoneNumber(twilio.getPhoneNumber()),
                    body
            ).create();
            log.info("SMS sent to {}", toPhone);
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", toPhone, e.getMessage());
        }
    }

    public String sendOtp(String region, String phone) {
        String six = String.valueOf((int) (Math.random() * 900000) + 100000);
        String to = "+" + region + phone;
        sendSms(to, "OTP is " + six);
        return six;
    }
}
