package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.HospitalRequest;
import com.appointware.entity.AccountsHospital;
import com.appointware.entity.AccountsUser;
import com.appointware.repository.AccountsHospitalRepository;
import com.appointware.repository.AccountsUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final AccountsHospitalRepository hospitalRepo;
    private final AccountsUserRepository userRepo;

    private static String orEmpty(String s) {
        return s == null ? "" : s;
    }

    public List<AccountsHospital> list() {
        List<AccountsHospital> hospitals = hospitalRepo.findAll();
        hospitals.forEach(this::populateUserName);
        return hospitals;
    }

    public AccountsHospital get(Integer id) {
        AccountsHospital h = hospitalRepo.findById(id)
                .orElseThrow(() -> ApiException.notFound("Hospital not found"));
        return populateUserName(h);
    }

    /**
     * Joins the username from accounts_user onto the transient userName
     * field so responses always include the credentials' username.
     */
    private AccountsHospital populateUserName(AccountsHospital h) {
        if (h.getUserId() != null) {
            userRepo.findById(h.getUserId()).ifPresent(u -> h.setUserName(u.getUserName()));
        }
        return h;
    }

    @Transactional
    public AccountsHospital create(HospitalRequest req) {
        Integer userId = req.getUserId();
        if (userId == null && req.getUserName() != null && !req.getUserName().isBlank()) {
            AccountsUser u = new AccountsUser();
            u.setUserName(req.getUserName());
            u.setPassword(req.getPassword() == null ? "" : req.getPassword());
            u.setEmail(req.getEmail());
            u.setPhone(req.getPhone());
            u.setIsActive("1");
            u.setIsDoctor("0");
            u.setIsStaff("0");
            u.setIsSuperuser("0");
            u.setIsDeleted(0);
            u.setPlanId(req.getPlanId() == null ? "" : req.getPlanId());
            u = userRepo.save(u);
            userId = u.getId();
        } else if (userId != null && req.getPlanId() != null) {
            // Existing user — still let the caller update plan_id if they pass it.
            userRepo.findById(userId).ifPresent(u -> {
                u.setPlanId(req.getPlanId());
                userRepo.save(u);
            });
        }

        // Legacy Django schema: these CharFields are NOT NULL and default to "".
        // Coalesce nulls so an omitted field doesn't violate the constraint.
        AccountsHospital h = AccountsHospital.builder()
                .name(req.getName())
                .phone(orEmpty(req.getPhone()))
                .regNo(orEmpty(req.getRegNo()))
                .img(orEmpty(req.getImg()))
                .email(orEmpty(req.getEmail()))
                .specility(orEmpty(req.getSpecility()))
                .street(orEmpty(req.getStreet()))
                .landmark(orEmpty(req.getLandmark()))
                .city(orEmpty(req.getCity()))
                .state(orEmpty(req.getState()))
                .zip(orEmpty(req.getZip()))
                .userId(userId)
                .isActive(req.getIsActive() == null ? 1 : req.getIsActive())
                .build();
        return populateUserName(hospitalRepo.save(h));
    }

    @Transactional
    public AccountsHospital update(Integer id, HospitalRequest req) {
        AccountsHospital h = get(id);
        if (req.getName() != null) h.setName(req.getName());
        if (req.getPhone() != null) h.setPhone(req.getPhone());
        if (req.getRegNo() != null) h.setRegNo(req.getRegNo());
        if (req.getImg() != null) h.setImg(req.getImg());
        if (req.getEmail() != null) h.setEmail(req.getEmail());
        if (req.getSpecility() != null) h.setSpecility(req.getSpecility());
        if (req.getStreet() != null) h.setStreet(req.getStreet());
        if (req.getLandmark() != null) h.setLandmark(req.getLandmark());
        if (req.getCity() != null) h.setCity(req.getCity());
        if (req.getState() != null) h.setState(req.getState());
        if (req.getZip() != null) h.setZip(req.getZip());
        if (req.getIsActive() != null) h.setIsActive(req.getIsActive());
        // planId / email live on accounts_user. Propagate when caller sends them.
        if ((req.getPlanId() != null || req.getEmail() != null) && h.getUserId() != null) {
            userRepo.findById(h.getUserId()).ifPresent(u -> {
                if (req.getPlanId() != null) u.setPlanId(req.getPlanId());
                if (req.getEmail() != null) u.setEmail(req.getEmail());
                userRepo.save(u);
            });
        }
        return populateUserName(hospitalRepo.save(h));
    }

    @Transactional
    public void blockUnblock(Integer id, Integer isActive) {
        AccountsHospital h = get(id);
        h.setIsActive(isActive);
        hospitalRepo.save(h);
        if (h.getUserId() != null) {
            userRepo.findById(h.getUserId()).ifPresent(u -> {
                u.setIsActive(String.valueOf(isActive));
                userRepo.save(u);
            });
        }
    }

    @Transactional
    public void delete(Integer id) {
        AccountsHospital h = get(id);
        if (h.getUserId() != null) {
            userRepo.findById(h.getUserId()).ifPresent(u -> {
                u.setIsDeleted(1);
                userRepo.save(u);
            });
        }
        hospitalRepo.delete(h);
    }
}
