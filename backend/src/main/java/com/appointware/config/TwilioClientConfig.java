package com.appointware.config;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class TwilioClientConfig {

    private final TwilioProperties twilioProperties;

    @PostConstruct
    public void init() {
        if (twilioProperties.isConfigured()) {
            Twilio.init(twilioProperties.getAccountSid(), twilioProperties.getAuthToken());
            log.info("Twilio initialized with phone number {}", twilioProperties.getPhoneNumber());
        } else {
            log.warn("Twilio credentials missing; SMS calls will be logged but not actually sent.");
        }
    }
}
