package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.DoctorRequest;
import com.appointware.entity.AccountsDoctor;
import com.appointware.entity.AccountsUser;
import com.appointware.repository.AccountsDoctorRepository;
import com.appointware.repository.AccountsUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final AccountsDoctorRepository doctorRepo;
    private final AccountsUserRepository userRepo;

    private static String orEmpty(String s) {
        return s == null ? "" : s;
    }

    public List<AccountsDoctor> list() {
        List<AccountsDoctor> doctors = doctorRepo.findByIsDeleted(0);
        doctors.forEach(this::populateUser);
        return doctors;
    }

    public AccountsDoctor get(Integer id) {
        AccountsDoctor d = doctorRepo.findById(id)
                .orElseThrow(() -> ApiException.notFound("Doctor not found"));
        return populateUser(d);
    }

    public List<AccountsDoctor> listByHospital(Integer hospitalId) {
        List<AccountsDoctor> doctors = doctorRepo.findByHospitalIdIdAndIsDeleted(hospitalId, 0);
        doctors.forEach(this::populateUser);
        return doctors;
    }

    /**
     * Joins email + username from accounts_user onto the transient fields so
     * responses always include the credentials' email and username.
     */
    private AccountsDoctor populateUser(AccountsDoctor d) {
        if (d.getUserId() != null) {
            userRepo.findById(d.getUserId()).ifPresent(u -> {
                d.setUserName(u.getUserName());
                d.setEmail(u.getEmail());
            });
        }
        return d;
    }

    public boolean exists(Integer hospitalId, String userName) {
        if (userName == null || userName.isBlank()) return false;
        return userRepo.findByUserName(userName)
                .filter(u -> {
                    AccountsDoctor d = doctorRepo.findByUserId(u.getId()).orElse(null);
                    return d != null && d.getHospitalIdId().equals(hospitalId);
                })
                .isPresent();
    }

    @Transactional
    public AccountsDoctor create(DoctorRequest req) {
        Integer userId = req.getUserId();
        if (userId == null && req.getUserName() != null && !req.getUserName().isBlank()) {
            AccountsUser u = new AccountsUser();
            u.setUserName(req.getUserName());
            u.setPassword(req.getPassword() == null ? "" : req.getPassword());
            u.setEmail(req.getEmail());
            u.setPhone(req.getPhone());
            u.setIsActive("1");
            u.setIsDoctor("1");
            u.setIsStaff("0");
            u.setIsSuperuser("0");
            u.setIsDeleted(0);
            u = userRepo.save(u);
            userId = u.getId();
        }

        // Legacy schema: these CharFields are NOT NULL and default to "".
        // Coalesce nulls so an omitted field doesn't violate the constraint.
        AccountsDoctor d = AccountsDoctor.builder()
                .firstName(orEmpty(req.getFirstName()))
                .lastName(orEmpty(req.getLastName()))
                .phone(orEmpty(req.getPhone()))
                .gender(orEmpty(req.getGender()))
                .img(orEmpty(req.getImg()))
                .specility(orEmpty(req.getSpecility()))
                .address(orEmpty(req.getAddress()))
                .city(orEmpty(req.getCity()))
                .state(orEmpty(req.getState()))
                .zipcode(orEmpty(req.getZipcode()))
                .timeZone(orEmpty(req.getTimeZone()))
                .fromTime(parseTimeOrZero(req.getFromTime()))
                .toTime(parseTimeOrZero(req.getToTime()))
                .consultTime(orEmpty(req.getConsultTime()))
                .intervel(orEmpty(req.getIntervel()))
                .smsIntervel(orEmpty(req.getSmsIntervel()))
                .smsCount(orEmpty(req.getSmsCount()))
                .fromTimeBreak(parseTimeOrZero(req.getFromTimeBreak()))
                .toTimeBreak(parseTimeOrZero(req.getToTimeBreak()))
                // New nullable columns — parseTime (not parseTimeOrZero) so a
                // blank value stays NULL rather than defaulting to midnight.
                .checkInTime(parseTime(req.getCheckInTime()))
                .checkOutTime(parseTime(req.getCheckOutTime()))
                .experience(orEmpty(req.getExperience()))
                .licence(orEmpty(req.getLicence()))
                .joinedDate(req.getJoinedDate() == null ? LocalDate.now() : LocalDate.parse(req.getJoinedDate()))
                .hospitalIdId(req.getHospitalIdId())
                // Legacy NOT NULL column that mirrors hospital_id_id.
                .hospitalIdIdCopy(req.getHospitalIdId())
                .userId(userId)
                .isActive(req.getIsActive() == null ? 1 : req.getIsActive())
                .isLunch(req.getIsLunch() == null ? 0 : req.getIsLunch())
                .timeType(orEmpty(req.getTimeType()))
                .googleLink(orEmpty(req.getGoogleLink()))
                .facebookLink(orEmpty(req.getFacebookLink()))
                .isDeleted(0)
                .build();
        return populateUser(doctorRepo.save(d));
    }

    @Transactional
    public AccountsDoctor update(Integer id, DoctorRequest req) {
        AccountsDoctor d = get(id);
        if (req.getFirstName() != null) d.setFirstName(req.getFirstName());
        if (req.getLastName() != null) d.setLastName(req.getLastName());
        if (req.getPhone() != null) d.setPhone(req.getPhone());
        if (req.getGender() != null) d.setGender(req.getGender());
        if (req.getImg() != null) d.setImg(req.getImg());
        if (req.getSpecility() != null) d.setSpecility(req.getSpecility());
        if (req.getAddress() != null) d.setAddress(req.getAddress());
        if (req.getCity() != null) d.setCity(req.getCity());
        if (req.getState() != null) d.setState(req.getState());
        if (req.getZipcode() != null) d.setZipcode(req.getZipcode());
        if (req.getTimeZone() != null) d.setTimeZone(req.getTimeZone());
        // from_time / to_time / *_break are legacy NOT NULL columns. The form
        // sends "" (e.g. when lunch is off), so use parseTimeOrZero to map a
        // blank value to 00:00:00 instead of null and avoid a constraint error.
        if (req.getFromTime() != null) d.setFromTime(parseTimeOrZero(req.getFromTime()));
        if (req.getToTime() != null) d.setToTime(parseTimeOrZero(req.getToTime()));
        if (req.getConsultTime() != null) d.setConsultTime(req.getConsultTime());
        if (req.getIntervel() != null) d.setIntervel(req.getIntervel());
        if (req.getSmsIntervel() != null) d.setSmsIntervel(req.getSmsIntervel());
        if (req.getSmsCount() != null) d.setSmsCount(req.getSmsCount());
        if (req.getFromTimeBreak() != null) d.setFromTimeBreak(parseTimeOrZero(req.getFromTimeBreak()));
        if (req.getToTimeBreak() != null) d.setToTimeBreak(parseTimeOrZero(req.getToTimeBreak()));
        if (req.getCheckInTime() != null) d.setCheckInTime(parseTime(req.getCheckInTime()));
        if (req.getCheckOutTime() != null) d.setCheckOutTime(parseTime(req.getCheckOutTime()));
        if (req.getExperience() != null) d.setExperience(req.getExperience());
        if (req.getLicence() != null) d.setLicence(req.getLicence());
        if (req.getHospitalIdId() != null) {
            d.setHospitalIdId(req.getHospitalIdId());
            d.setHospitalIdIdCopy(req.getHospitalIdId());
        }
        if (req.getIsActive() != null) d.setIsActive(req.getIsActive());
        if (req.getIsLunch() != null) d.setIsLunch(req.getIsLunch());
        if (req.getTimeType() != null) d.setTimeType(req.getTimeType());
        if (req.getGoogleLink() != null) d.setGoogleLink(req.getGoogleLink());
        if (req.getFacebookLink() != null) d.setFacebookLink(req.getFacebookLink());
        // Also propagate email change to the linked AccountsUser, since that's
        // the source of truth for email on the response.
        if (req.getEmail() != null && d.getUserId() != null) {
            userRepo.findById(d.getUserId()).ifPresent(u -> {
                u.setEmail(req.getEmail());
                userRepo.save(u);
            });
        }
        return populateUser(doctorRepo.save(d));
    }

    @Transactional
    public void blockUnblock(Integer id, Integer isActive) {
        AccountsDoctor d = get(id);
        d.setIsActive(isActive);
        doctorRepo.save(d);
        if (d.getUserId() != null) {
            userRepo.findById(d.getUserId()).ifPresent(u -> {
                u.setIsActive(String.valueOf(isActive));
                userRepo.save(u);
            });
        }
    }

    @Transactional
    public void delete(Integer id) {
        AccountsDoctor d = get(id);
        d.setIsDeleted(1);
        doctorRepo.save(d);
        if (d.getUserId() != null) {
            userRepo.findById(d.getUserId()).ifPresent(u -> {
                u.setIsDeleted(1);
                userRepo.save(u);
            });
        }
    }

    private static LocalTime parseTime(String s) {
        if (s == null || s.isBlank()) return null;
        try { return LocalTime.parse(s); }
        catch (Exception e) { return null; }
    }

    /**
     * Like parseTime but never null — the legacy accounts_doctor time columns
     * are NOT NULL, so an omitted/blank value must default to 00:00:00.
     */
    private static LocalTime parseTimeOrZero(String s) {
        LocalTime t = parseTime(s);
        return t == null ? LocalTime.MIDNIGHT : t;
    }
}
