package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.SubscriptionRequest;
import com.appointware.dto.request.SubscriptionSetupRequest;
import com.appointware.entity.AccountSubscription;
import com.appointware.entity.AccountSubscriptionSetup;
import com.appointware.repository.AccountSubscriptionRepository;
import com.appointware.repository.AccountSubscriptionSetupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final AccountSubscriptionRepository subRepo;
    private final AccountSubscriptionSetupRepository setupRepo;

    public List<AccountSubscription> list() { return subRepo.findAll(); }

    public List<AccountSubscription> listByUser(String userId) { return subRepo.findByUserId(userId); }

    public AccountSubscription get(Integer id) {
        return subRepo.findById(id).orElseThrow(() -> ApiException.notFound("Subscription not found"));
    }

    @Transactional
    public AccountSubscription create(SubscriptionRequest req) {
        AccountSubscription s = AccountSubscription.builder()
                .userId(req.getUserId())
                .cardName(req.getCardName())
                .cardNumber(req.getCardNumber())
                .cardMonth(req.getCardMonth())
                .cardYear(req.getCardYear())
                .address1(req.getAddress1())
                .address2(req.getAddress2())
                .city(req.getCity())
                .state(req.getState())
                .zip(req.getZip())
                .country(req.getCountry())
                .build();
        return subRepo.save(s);
    }

    @Transactional
    public AccountSubscription update(Integer id, SubscriptionRequest req) {
        AccountSubscription s = get(id);
        if (req.getCardName() != null) s.setCardName(req.getCardName());
        if (req.getCardNumber() != null) s.setCardNumber(req.getCardNumber());
        if (req.getCardMonth() != null) s.setCardMonth(req.getCardMonth());
        if (req.getCardYear() != null) s.setCardYear(req.getCardYear());
        if (req.getAddress1() != null) s.setAddress1(req.getAddress1());
        if (req.getAddress2() != null) s.setAddress2(req.getAddress2());
        if (req.getCity() != null) s.setCity(req.getCity());
        if (req.getState() != null) s.setState(req.getState());
        if (req.getZip() != null) s.setZip(req.getZip());
        if (req.getCountry() != null) s.setCountry(req.getCountry());
        return subRepo.save(s);
    }

    @Transactional
    public void delete(Integer id) { subRepo.deleteById(id); }

    // ------- Plans (setup) -------

    public List<AccountSubscriptionSetup> listPlans() {
        return setupRepo.findByStatusAndIsDeleted(1, 0);
    }

    public AccountSubscriptionSetup getPlan(Integer id) {
        return setupRepo.findById(id).orElseThrow(() -> ApiException.notFound("Plan not found"));
    }

    @Transactional
    public AccountSubscriptionSetup createPlan(SubscriptionSetupRequest req) {
        AccountSubscriptionSetup s = AccountSubscriptionSetup.builder()
                .title1(req.getTitle1())
                .title2(req.getTitle2())
                .price(req.getPrice())
                .priceTitle(req.getPriceTitle())
                .button1(req.getButton1())
                .description1(req.getDescription1())
                .button2(req.getButton2())
                .description2(req.getDescription2())
                .description2Number(req.getDescription2Number())
                .description3(req.getDescription3())
                .iosIdentifier(req.getIosIdentifier())
                .status(req.getStatus() == null ? 1 : req.getStatus())
                .isDeleted(0)
                .build();
        return setupRepo.save(s);
    }

    @Transactional
    public AccountSubscriptionSetup updatePlan(Integer id, SubscriptionSetupRequest req) {
        AccountSubscriptionSetup s = getPlan(id);
        if (req.getTitle1() != null) s.setTitle1(req.getTitle1());
        if (req.getTitle2() != null) s.setTitle2(req.getTitle2());
        if (req.getPrice() != null) s.setPrice(req.getPrice());
        if (req.getPriceTitle() != null) s.setPriceTitle(req.getPriceTitle());
        if (req.getButton1() != null) s.setButton1(req.getButton1());
        if (req.getDescription1() != null) s.setDescription1(req.getDescription1());
        if (req.getButton2() != null) s.setButton2(req.getButton2());
        if (req.getDescription2() != null) s.setDescription2(req.getDescription2());
        if (req.getDescription2Number() != null) s.setDescription2Number(req.getDescription2Number());
        if (req.getDescription3() != null) s.setDescription3(req.getDescription3());
        if (req.getIosIdentifier() != null) s.setIosIdentifier(req.getIosIdentifier());
        if (req.getStatus() != null) s.setStatus(req.getStatus());
        return setupRepo.save(s);
    }

    @Transactional
    public void deletePlan(Integer id) {
        AccountSubscriptionSetup s = getPlan(id);
        s.setIsDeleted(1);
        setupRepo.save(s);
    }
}
