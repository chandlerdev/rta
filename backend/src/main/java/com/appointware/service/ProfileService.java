package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.entity.AccountsProfile;
import com.appointware.repository.AccountsProfileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final AccountsProfileRepository repo;

    public List<AccountsProfile> list() { return repo.findAll(); }
    public AccountsProfile get(Integer id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Profile not found"));
    }
    public AccountsProfile getByUser(Integer userId) {
        return repo.findByUserId(userId).orElseThrow(() -> ApiException.notFound("Profile not found"));
    }

    @Transactional
    public AccountsProfile save(AccountsProfile in) {
        if (in.getJoined() == null) in.setJoined(LocalDateTime.now());
        return repo.save(in);
    }

    @Transactional
    public AccountsProfile update(Integer id, AccountsProfile in) {
        AccountsProfile p = get(id);
        if (in.getFirstName() != null) p.setFirstName(in.getFirstName());
        if (in.getLastName() != null) p.setLastName(in.getLastName());
        if (in.getPhone() != null) p.setPhone(in.getPhone());
        if (in.getImg() != null) p.setImg(in.getImg());
        if (in.getUserId() != null) p.setUserId(in.getUserId());
        return repo.save(p);
    }

    @Transactional
    public void delete(Integer id) { repo.deleteById(id); }
}
