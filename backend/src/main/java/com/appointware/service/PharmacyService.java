package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.PharmacyRequest;
import com.appointware.entity.AccountsPharmacy;
import com.appointware.repository.AccountsPharmacyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final AccountsPharmacyRepository repo;

    public List<AccountsPharmacy> list() {
        return repo.findByIsDeleted(0);
    }

    public AccountsPharmacy get(Integer id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Pharmacy not found"));
    }

    @Transactional
    public AccountsPharmacy create(PharmacyRequest req) {
        AccountsPharmacy p = AccountsPharmacy.builder()
                .pharmacyName(req.getPharmacyName())
                .address(req.getAddress())
                .phone(req.getPhone())
                .email(req.getEmail())
                .status(req.getStatus() == null ? 1 : req.getStatus())
                .isDeleted(0)
                .build();
        return repo.save(p);
    }

    @Transactional
    public AccountsPharmacy update(Integer id, PharmacyRequest req) {
        AccountsPharmacy p = get(id);
        if (req.getPharmacyName() != null) p.setPharmacyName(req.getPharmacyName());
        if (req.getAddress() != null) p.setAddress(req.getAddress());
        if (req.getPhone() != null) p.setPhone(req.getPhone());
        if (req.getEmail() != null) p.setEmail(req.getEmail());
        if (req.getStatus() != null) p.setStatus(req.getStatus());
        return repo.save(p);
    }

    @Transactional
    public void delete(Integer id) {
        AccountsPharmacy p = get(id);
        p.setIsDeleted(1);
        repo.save(p);
    }
}
