package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.entity.ZcmsMailConfiguration;
import com.appointware.repository.ZcmsMailConfigurationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MailConfigurationService {

    private final ZcmsMailConfigurationRepository repo;

    public List<ZcmsMailConfiguration> list() { return repo.findAll(); }

    public ZcmsMailConfiguration get(Integer id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Mail config not found"));
    }

    @Transactional
    public ZcmsMailConfiguration save(ZcmsMailConfiguration in) {
        if (in.getStatus() == null) in.setStatus(1);
        if (in.getIsDeleted() == null) in.setIsDeleted(0);
        return repo.save(in);
    }

    @Transactional
    public ZcmsMailConfiguration update(Integer id, ZcmsMailConfiguration in) {
        ZcmsMailConfiguration m = get(id);
        if (in.getHost() != null) m.setHost(in.getHost());
        if (in.getPort() != null) m.setPort(in.getPort());
        if (in.getEmail() != null) m.setEmail(in.getEmail());
        if (in.getPassword() != null) m.setPassword(in.getPassword());
        if (in.getMailFrom() != null) m.setMailFrom(in.getMailFrom());
        if (in.getFromName() != null) m.setFromName(in.getFromName());
        if (in.getStatus() != null) m.setStatus(in.getStatus());
        return repo.save(m);
    }

    @Transactional
    public void delete(Integer id) {
        ZcmsMailConfiguration m = get(id);
        m.setIsDeleted(1);
        repo.save(m);
    }
}
