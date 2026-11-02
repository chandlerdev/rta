package com.appointware.service;

import com.appointware.config.MailProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final MailProperties mailProperties;

    public void sendHtml(String to, String subject, String htmlBody) {
        if (mailProperties.getFrom() == null || mailProperties.getFrom().isBlank()) {
            log.warn("[MAIL-STUB] to={} subject={}", to, subject);
            return;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, StandardCharsets.UTF_8.name());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            try {
                helper.setFrom(mailProperties.getFrom(), mailProperties.getFromName());
            } catch (UnsupportedEncodingException e) {
                helper.setFrom(mailProperties.getFrom());
            }
            mailSender.send(msg);
            log.info("Mail sent to {}", to);
        } catch (MessagingException | RuntimeException e) {
            // Includes Spring's MailException (runtime) thrown by mailSender.send()
            // for SMTP/connection failures — log and swallow so the API doesn't 500.
            log.error("Failed to send mail to {}: {}", to, e.getMessage());
        }
    }
}
