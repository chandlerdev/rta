package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.dto.request.AppointmentCompleteRequest;
import com.appointware.dto.response.HospitalAppointmentsResponse;
import com.appointware.entity.AccountsAppointment;
import com.appointware.entity.AccountsDoctor;
import com.appointware.entity.AccountsPatient;
import com.appointware.entity.DoctorTemplate;
import com.appointware.repository.AccountsAppointmentRepository;
import com.appointware.repository.AccountsDoctorRepository;
import com.appointware.repository.AccountsPatientRepository;
import com.appointware.repository.DoctorTemplateRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AccountsAppointmentRepository appointmentRepo;
    private final AccountsDoctorRepository doctorRepo;
    private final AccountsPatientRepository patientRepo;
    private final DoctorTemplateRepository templateRepo;
    private final SmsService smsService;

    private static final DateTimeFormatter TF = DateTimeFormatter.ofPattern("HH:mm:ss");

    public AccountsAppointment get(Integer id) {
        return appointmentRepo.findById(id)
                .orElseThrow(() -> ApiException.notFound("Appointment not found"));
    }

    /**
     * Hard-delete an appointment. Mirrors the legacy PHP
     * "delete&table=accounts_appointment&id=" which removed the row outright
     * (accounts_appointment has no is_deleted column).
     */
    @Transactional
    public void delete(Integer id) {
        AccountsAppointment a = get(id);
        appointmentRepo.delete(a);
    }

    public List<AccountsAppointment> getByDoctor(Integer doctorId) {
        return appointmentRepo.findByDocIdId(doctorId);
    }

    public List<AccountsAppointment> getByDoctorAndDate(Integer doctorId, String date) {
        return appointmentRepo.findByDocIdIdAndDate(doctorId, normalizeDate(date));
    }

    public List<AccountsAppointment> getCompletedByDoctor(Integer doctorId) {
        return appointmentRepo.findByDocIdIdAndIsCompleted(doctorId, 1);
    }

    public List<HospitalAppointmentsResponse> hospitalAppointments(Integer hospitalId, String date) {
        List<AccountsDoctor> doctors = doctorRepo.findByHospitalIdIdAndIsDeleted(hospitalId, 0);
        String normalized = normalizeDate(date);
        List<HospitalAppointmentsResponse> out = new ArrayList<>();
        for (AccountsDoctor d : doctors) {
            List<AccountsAppointment> appts = (normalized == null || normalized.isBlank())
                    ? appointmentRepo.findByDocIdId(d.getId())
                    : appointmentRepo.findByDocIdIdAndDate(d.getId(), normalized);
            for (AccountsAppointment a : appts) {
                AccountsPatient p = a.getPatientIdId() == null ? null
                        : patientRepo.findById(a.getPatientIdId()).orElse(null);
                out.add(new HospitalAppointmentsResponse(
                        a.getId(), a.getDate(), a.getFromTime(), a.getToTime(),
                        a.getReschduleTime(), a.getIsCompleted(), a.getIsShow(),
                        d.getId(), trim(d.getFirstName()),
                        p == null ? null : p.getId(),
                        p == null ? "" : trim(p.getFirstName()),
                        p == null ? "" : p.getPhone(),
                        p == null ? "" : p.getEmail()
                ));
            }
        }
        return out;
    }

    /**
     * Mirrors custom_appointment_update1 in PHP: marks the current slot complete and,
     * if it ran past the configured delay, pushes the following N appointments forward
     * by `intervel`, sending reschedule SMSes for the first `noSms` of them.
     */
    @Transactional
    public AccountsAppointment completeAndReschedule(AppointmentCompleteRequest req) {
        AccountsAppointment current = get(req.getAppointmentId());
        log.info("[complete] id={} doctorId(req)={} fromTime(req)={} toTime(req)={} isLunch={} - stored fromTime={} toTime={} delay={} date={}",
                req.getAppointmentId(), req.getDoctorId(), req.getFromTime(), req.getToTime(), req.getIsLunch(),
                current.getFromTime(), current.getToTime(), current.getDelay(), current.getDate());

        // PHP reads these straight from the request (blank when absent).
        Integer doctorId = req.getDoctorId() != null ? req.getDoctorId() : current.getDocIdId();
        String fromTime = req.getFromTime() == null ? "" : req.getFromTime();
        String toTime = req.getToTime() == null ? "" : req.getToTime();
        Integer isCompletedVal = req.getIsCompleted() == null ? 1 : req.getIsCompleted();
        String delayStr = current.getDelay() == null ? "00:00:00" : current.getDelay();

        // PHP custom_appointment_update1: both branches reject a re-completion
        // of an already-completed appointment (lines 2988 and 3255).
        if (current.getIsCompleted() != null && current.getIsCompleted() == 1) {
            throw ApiException.badRequest("Already appointment completed");
        }

        // Lunch-break handling applies when is_lunch != 1 and the doctor's break
        // window was supplied (PHP else-branch of custom_appointment_update1).
        String fromTimeBreak = req.getFromTimeBreak();
        String toTimeBreak = req.getToTimeBreak();
        boolean hasLunch = (req.getIsLunch() == null || req.getIsLunch() != 1)
                && fromTimeBreak != null && !fromTimeBreak.isBlank()
                && toTimeBreak != null && !toTimeBreak.isBlank();
        // PHP checks "is this the last slot before lunch?" while the row is still
        // incomplete, so determine it before we mark current complete.
        boolean lastBeforeBreak = hasLunch && isLastBeforeBreak(doctorId, current, fromTimeBreak);

        current.setIsCompleted(isCompletedVal);
        current.setToTime(toTime);
        current.setFeedback(req.getFeedback());
        appointmentRepo.save(current);

        // Feedback SMS to the completed patient (PHP sends this in both branches).
        if (current.getPatientIdId() != null) {
            AccountsPatient p = patientRepo.findById(current.getPatientIdId()).orElse(null);
            if (p != null && p.getPhone() != null && !p.getPhone().isBlank()) {
                String name = "Hi " + safe(p.getFirstName()) + " " + safe(p.getLastName())
                        + ", thanks for choosing RealTime Appointment. What was your experience"
                        + " with us? Please let us know: https://g.page/r/CVEoOxLT-lbwEB0/review";
                smsService.sendSms(p.getPhone(), name);
            }
        }

        // PHP: if the completed appointment is itself the last slot before lunch,
        // there is nothing between it and the break to push - just leave it done.
        if (lastBeforeBreak) return current;

        // Overrun = abs(toTime - (reschduleTime || fromTime))   [PHP uses
        // DateInterval::format('%H:%I:%S') which is always unsigned].
        String currentTimeStr = (current.getReschduleTime() != null && !current.getReschduleTime().isBlank())
                ? current.getReschduleTime()
                : current.getFromTime();
        if (toTime.isBlank() || currentTimeStr == null || currentTimeStr.isBlank()) return current;

        Duration overrun = Duration.between(
                LocalTime.parse(currentTimeStr, TF),
                LocalTime.parse(toTime, TF)).abs();
        Duration allowed = parseHms(delayStr);
        log.info("[complete] overrun={} allowed={} -> {}",
                overrun, allowed, overrun.compareTo(allowed) > 0 ? "CASCADE" : "SKIP");
        if (overrun.compareTo(allowed) <= 0) return current;

        int noSms = req.getNoSms() == null ? 2 : req.getNoSms();

        // intervel / sms_intervel arrive either as HH:MM:SS (legacy PHP doctors)
        // or as plain minutes (the form collects "mins"); blank uses the default.
        Duration intervelDur = parseInterval(req.getIntervel());
        Duration smsIntervelDur = parseInterval(req.getSmsIntervel());
        // PHP: $find_intervel = $delay + $intervel  (line 3137)
        // Used for spacing between slots from iteration #2 onward.
        Duration combinedDur = intervelDur.plus(allowed);

        // Lunch-aware cascade (PHP else-branch): bounds the cascade to before
        // the break and, when a slot would land inside the break, pushes the
        // affected slots to start at the break end.
        if (hasLunch) {
            return lunchAwareReschedule(current, doctorId, fromTime, toTime,
                    intervelDur, combinedDur, smsIntervelDur, noSms,
                    fromTimeBreak, toTimeBreak);
        }

        List<AccountsAppointment> following = appointmentRepo.findFollowingSlots(
                doctorId, current.getDate(), fromTime);
        log.info("[complete] findFollowingSlots(docId={}, date={}, fromTime>{}): {} rows",
                doctorId, current.getDate(), fromTime, following.size());

        // Reschedule EVERY following slot (a late appointment pushes the whole
        // remaining day). SMS stays limited to the PHP window: offset 2 .. 2+no_sms.
        int smsStart = 2;
        int smsEndExclusive = 2 + noSms;

        LocalTime cursor = LocalTime.parse(toTime, TF);
        for (int i = 0; i < following.size(); i++) {
            AccountsAppointment next = following.get(i);
            // First slot is at toTime + intervel; subsequent slots are spaced
            // by (intervel + delay) - matches PHP custom_time() math.
            cursor = (i == 0) ? cursor.plus(intervelDur) : cursor.plus(combinedDur);
            next.setReschduleTime(cursor.format(TF));
            appointmentRepo.save(next);
            log.info("[complete] reschedule id={} fromTime={} -> reschduleTime={}",
                    next.getId(), next.getFromTime(), cursor.format(TF));

            boolean smsTarget = (i >= smsStart && i < smsEndExclusive)
                    && (next.getIsSms() == null || next.getIsSms() == 0)
                    && next.getPatientIdId() != null
                    && next.getFromTime() != null && !next.getFromTime().isBlank();
            if (!smsTarget) continue;

            Duration shift = Duration.between(
                    LocalTime.parse(next.getFromTime(), TF), cursor).abs();
            if (shift.compareTo(smsIntervelDur) < 0) continue;

            AccountsPatient p = patientRepo.findById(next.getPatientIdId()).orElse(null);
            if (p == null || p.getPhone() == null || p.getPhone().isBlank()) continue;

            String msg = resolveTemplate(doctorId, p, next.getDate(), cursor.format(TF), false);
            smsService.sendSms(p.getPhone(), msg);
            next.setIsSms(1);
            appointmentRepo.save(next);
        }
        return current;
    }

    /**
     * PHP "Check with last id before lunch" (custom_appointment_update1 ~line 3320).
     * Prefer the last not-shown/not-completed slot whose reschdule_time is before
     * the break; fall back to the last whose from_time is before the break. The
     * completed appointment is the last-before-lunch slot when that row's id ==
     * current.id. Evaluated while current is still incomplete.
     */
    private boolean isLastBeforeBreak(Integer doctorId, AccountsAppointment current, String breakStart) {
        List<AccountsAppointment> cl =
                appointmentRepo.findLastRescheduledBeforeBreak(doctorId, current.getDate(), breakStart);
        if (cl.isEmpty()) {
            cl = appointmentRepo.findLastBeforeBreak(doctorId, current.getDate(), breakStart);
        }
        return !cl.isEmpty() && cl.get(0).getId().equals(current.getId());
    }

    /**
     * PHP else-branch cascade (is_lunch != 1). Reschedules the following slots
     * exactly like the simple cascade, but:
     *   - bounds the following set to slots before the break when to_time is
     *     itself before the break (PHP: $to_time &lt; $from_time_break);
     *   - when a computed reschedule time would land inside the break window
     *     (from_time_break .. to_time_break), instead pushes the remaining
     *     pre-break slots plus the first no_sms post-break slots to start at
     *     to_time_break (spaced by intervel+delay) and stops.
     */
    private AccountsAppointment lunchAwareReschedule(AccountsAppointment current, Integer doctorId,
            String fromTime, String toTime, Duration intervelDur, Duration combinedDur,
            Duration smsIntervelDur, int noSms, String fromTimeBreak, String toTimeBreak) {

        boolean toBeforeBreak = compareTime(toTime, fromTimeBreak) < 0;
        List<AccountsAppointment> following = toBeforeBreak
                ? appointmentRepo.findFollowingSlotsBeforeBreak(doctorId, current.getDate(), fromTime, fromTimeBreak)
                : appointmentRepo.findFollowingSlots(doctorId, current.getDate(), fromTime);
        log.info("[complete][lunch] toBeforeBreak={} following={} break={}..{}",
                toBeforeBreak, following.size(), fromTimeBreak, toTimeBreak);

        // Reschedule EVERY following slot; SMS stays limited to offset 2 .. 2+no_sms.
        int smsStart = 2;
        int smsEndExclusive = 2 + noSms;

        LocalTime firstReschedule = null; // following.get(0)'s reschedule time
        for (int i = 0; i < following.size(); i++) {
            AccountsAppointment next = following.get(i);
            LocalTime result1 = (i == 0)
                    ? LocalTime.parse(toTime, TF).plus(intervelDur)
                    : firstReschedule.plus(combinedDur.multipliedBy(i));

            // --- PHP "Special concept for lunch" ---
            boolean inBreak = compareTime(result1.format(TF), fromTimeBreak) > 0
                    && compareTime(result1.format(TF), toTimeBreak) < 0;
            if (inBreak) {
                // If the break slot is already placed (something already ends at
                // the break end), PHP does nothing for this slot - skip it.
                if (!appointmentRepo.findEndingAtBreakEnd(doctorId, current.getDate(), toTimeBreak).isEmpty()) {
                    continue;
                }
                pushAcrossLunch(current, doctorId, next.getFromTime(), combinedDur,
                        smsIntervelDur, noSms, fromTimeBreak, toTimeBreak);
                return current; // PHP: die after the lunch displacement
            }

            // --- Normal reschedule of this slot ---
            if (i == 0) firstReschedule = result1;
            next.setReschduleTime(result1.format(TF));
            appointmentRepo.save(next);
            log.info("[complete][lunch] reschedule id={} fromTime={} -> {}",
                    next.getId(), next.getFromTime(), result1.format(TF));

            boolean smsTarget = (i >= smsStart && i < smsEndExclusive)
                    && (next.getIsSms() == null || next.getIsSms() == 0)
                    && next.getPatientIdId() != null
                    && next.getFromTime() != null && !next.getFromTime().isBlank();
            if (!smsTarget) continue;

            Duration shift = Duration.between(
                    LocalTime.parse(next.getFromTime(), TF), result1).abs();
            if (shift.compareTo(smsIntervelDur) < 0) continue;

            AccountsPatient p = patientRepo.findById(next.getPatientIdId()).orElse(null);
            if (p == null || p.getPhone() == null || p.getPhone().isBlank()) continue;
            String msg = resolveTemplate(doctorId, p, next.getDate(), result1.format(TF), false);
            smsService.sendSms(p.getPhone(), msg);
            next.setIsSms(1);
            appointmentRepo.save(next);
        }
        return current;
    }

    /**
     * PHP lunch displacement (custom_appointment_update1 ~line 3510): take the
     * remaining pre-break slots (from_time &gt;= the slot that hit the break) plus
     * the first no_sms post-break slots, and reschedule them all to start at the
     * break end, spaced by (intervel+delay). Sends a reschedule SMS for each.
     */
    private void pushAcrossLunch(AccountsAppointment current, Integer doctorId, String fromTime,
            Duration combinedDur, Duration smsIntervelDur, int noSms,
            String fromTimeBreak, String toTimeBreak) {

        // Reschedule every remaining pre-break slot plus every post-break slot.
        List<AccountsAppointment> merged = new ArrayList<>(
                appointmentRepo.findSlotsUntilBreak(doctorId, current.getDate(), fromTime, fromTimeBreak));
        merged.addAll(appointmentRepo.findSlotsAfterBreak(doctorId, current.getDate(), fromTimeBreak));

        LocalTime breakEnd = LocalTime.parse(toTimeBreak, TF);
        int z = 0;
        for (AccountsAppointment slot : merged) {
            LocalTime rt = (z == 0) ? breakEnd : breakEnd.plus(combinedDur.multipliedBy(z));
            slot.setReschduleTime(rt.format(TF));
            log.info("[complete][lunch] push id={} fromTime={} -> {}",
                    slot.getId(), slot.getFromTime(), rt.format(TF));

            // SMS only for the first no_sms displaced slots.
            if (z < noSms && (slot.getIsSms() == null || slot.getIsSms() == 0)
                    && slot.getPatientIdId() != null) {
                AccountsPatient p = patientRepo.findById(slot.getPatientIdId()).orElse(null);
                if (p != null && p.getPhone() != null && !p.getPhone().isBlank()) {
                    String msg = resolveTemplate(doctorId, p, slot.getDate(), rt.format(TF), false);
                    smsService.sendSms(p.getPhone(), msg);
                    slot.setIsSms(1);
                }
            }
            appointmentRepo.save(slot);
            z++;
        }
    }

    /** Compare two "HH:mm:ss" times; negative/zero/positive like compareTo. */
    private static int compareTime(String a, String b) {
        if (a == null || a.isBlank() || b == null || b.isBlank()) return 0;
        try { return LocalTime.parse(a, TF).compareTo(LocalTime.parse(b, TF)); }
        catch (Exception e) { return a.compareTo(b); }
    }

    @Transactional
    public AccountsAppointment markNoShow(Integer appointmentId) {
        AccountsAppointment a = get(appointmentId);
        a.setIsCompleted(2); // 2 == no-show in our convention
        return appointmentRepo.save(a);
    }

    @Transactional
    public AccountsAppointment toggleShow(Integer appointmentId, Integer isShow) {
        AccountsAppointment a = get(appointmentId);
        a.setIsShow(isShow);
        return appointmentRepo.save(a);
    }

    // ------------------------------------------------------------------
    // Today advance-SMS broadcasts
    // PHP equivalents: today_doctor_patient_sms, today_sms (today_twilio_sms),
    // cron_today_doctor_patient_sms
    // ------------------------------------------------------------------

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("MM-dd-yyyy");

    /**
     * PHP: today_doctor_patient_sms - on-demand. For ONE doctor: find today's
     * incomplete, not-yet-shown appointments (in the doctor's timezone), look
     * up each patient, render the doctor's advance SMS template, and send it
     * via Twilio. Returns how many SMS were dispatched.
     */
    public int sendTodayAdvanceSmsForDoctor(Integer doctorId) {
        AccountsDoctor d = doctorRepo.findById(doctorId)
                .orElseThrow(() -> ApiException.notFound("Doctor not found"));
        int sent = broadcastTodayForDoctor(d, false);
        if (sent == 0) throw ApiException.forbidden("No patient available today");
        return sent;
    }

    /**
     * PHP: today_sms (today_twilio_sms) - on-demand. Loops over EVERY appointment
     * today (no doctor filter, no completion filter) and sends a hardcoded
     * advance reminder. No template is consulted.
     */
    public int sendTodayAdvanceSmsAll() {
        String today = LocalDate.now(ZoneId.of("America/Chicago")).format(DATE_FMT);
        List<AccountsAppointment> todays = appointmentRepo.findByDate(today);
        if (todays.isEmpty()) throw ApiException.forbidden("No patient available today");

        int sent = 0;
        for (AccountsAppointment a : todays) {
            if (a.getPatientIdId() == null) continue;
            AccountsPatient p = patientRepo.findById(a.getPatientIdId()).orElse(null);
            if (p == null || p.getPhone() == null || p.getPhone().isBlank()) continue;
            String msg = "Hi " + safe(p.getFirstName()) + " " + safe(p.getLastName())
                    + ", Your appointment today " + a.getDate() + " at " + a.getFromTime()
                    + ". Please come before 15 minutes. We look forward to seeing you.";
            smsService.sendSms(p.getPhone(), msg);
            sent++;
        }
        return sent;
    }

    /**
     * PHP: cron_today_doctor_patient_sms - same as the per-doctor flow but for
     * EVERY active, not-deleted doctor, with the extra filter "cur_time &lt; from_time"
     * in that doctor's timezone (so patients whose slot has already passed are
     * skipped).
     */
    public int sendTodayAdvanceSmsForAllDoctors() {
        int sent = 0;
        for (AccountsDoctor d : doctorRepo.findByIsActiveAndIsDeleted(1, 0)) {
            sent += broadcastTodayForDoctor(d, true);
        }
        return sent;
    }

    /**
     * Runs the cron version once a day at 08:00 server time. Adjust the cron
     * expression in @Scheduled if you want a different cadence.
     * Cron format: sec min hour day-of-month month day-of-week.
     */
    @org.springframework.scheduling.annotation.Scheduled(cron = "0 0 8 * * *")
    public void scheduledTodayAdvanceSms() {
        try {
            int sent = sendTodayAdvanceSmsForAllDoctors();
            log.info("[cron] today-advance-sms dispatched {} messages", sent);
        } catch (Exception e) {
            log.error("[cron] today-advance-sms failed", e);
        }
    }

    private int broadcastTodayForDoctor(AccountsDoctor d, boolean respectCurrentTime) {
        ZoneId zone = resolveZone(d.getTimeZone());
        ZonedDateTime nowInZone = ZonedDateTime.now(zone);
        String today = nowInZone.toLocalDate().format(DATE_FMT);
        LocalTime cursor = nowInZone.toLocalTime();

        List<AccountsAppointment> todays = appointmentRepo
                .findTodayCandidatesForDoctor(d.getId(), today);
        int sent = 0;
        for (AccountsAppointment a : todays) {
            if (respectCurrentTime && !isLater(a.getFromTime(), cursor)) continue;
            if (a.getPatientIdId() == null) continue;
            AccountsPatient p = patientRepo.findById(a.getPatientIdId()).orElse(null);
            if (p == null || p.getPhone() == null || p.getPhone().isBlank()) continue;
            String msg = resolveTemplate(d.getId(), p, a.getDate(), a.getFromTime(), true);
            smsService.sendSms(p.getPhone(), msg);
            sent++;
        }
        return sent;
    }

    private static ZoneId resolveZone(String tz) {
        if (tz == null || tz.isBlank()) return ZoneId.of("America/Chicago");
        try { return ZoneId.of(tz); }
        catch (Exception e) { return ZoneId.of("America/Chicago"); }
    }

    /** True if fromTime ("HH:mm:ss") is strictly later than now in zone. */
    private static boolean isLater(String fromTime, LocalTime nowInZone) {
        if (fromTime == null || fromTime.isBlank()) return false;
        try { return LocalTime.parse(fromTime, TF).isAfter(nowInZone); }
        catch (Exception e) { return false; }
    }

    private String resolveTemplate(Integer doctorId, AccountsPatient p, String date, String time, boolean advance) {
        DoctorTemplate t = templateRepo.findByDoctorId(doctorId).orElse(null);
        String full = safe(p.getFirstName()) + " " + safe(p.getLastName());
        if (t != null) {
            String src = advance ? t.getAdvanceSmsTemplate() : t.getRescheduleSmsTemplate();
            if (src != null && !src.isBlank()) {
                // PHP reschedule: BOTH %%DATE%% and %%TIME%% are the reschedule time.
                String dateToken = advance ? (date == null ? "" : date) : (time == null ? "" : time);
                return src
                        .replace("%%DATE%%", dateToken)
                        .replace("%%TIME%%", time == null ? "" : time)
                        .replace("%%NAME%%", full)
                        .replaceAll("<[^>]+>", "");
            }
        }
        return advance
                ? "Hi " + full + ", your appointment is on " + date + " at " + time + "."
                : "Hi " + full + ", We are sorry to inform you that we have to reschedule your"
                        + " appointment. Your reschedule appointment will be at: " + time;
    }

    /**
     * intervel / sms_intervel come in two shapes: legacy PHP doctors store
     * "HH:MM:SS"; the current form collects whole minutes ("5"). Blank falls
     * back to PHP's 5-minute default. Without this, a blank or minutes value
     * parsed as HH:MM:SS collapses the spacing to zero, so every following slot
     * gets the same reschedule time.
     */
    private static Duration parseInterval(String v) {
        if (v == null || v.isBlank()) return Duration.ofMinutes(5);
        String s = v.trim();
        if (s.contains(":")) return parseHms(s);
        try { return Duration.ofMinutes(Long.parseLong(s)); }
        catch (NumberFormatException e) { return Duration.ofMinutes(5); }
    }

    private static Duration parseHms(String hms) {
        if (hms == null || hms.isBlank()) return Duration.ZERO;
        String[] p = hms.split(":");
        return Duration.ofHours(Long.parseLong(p[0]))
                .plusMinutes(Long.parseLong(p[1]))
                .plusSeconds(p.length > 2 ? Long.parseLong(p[2]) : 0);
    }

    private static String safe(String s) { return s == null ? "" : s.trim(); }
    private static String trim(String s) { return s == null ? "" : s.trim(); }

    /**
     * Accept dates in either MM-DD-YYYY (PHP/import format, what's stored in
     * accounts_appointment.date) or YYYY-MM-DD (ISO, what the frontend usually
     * sends), and always return the MM-DD-YYYY form used by the DB column.
     * Returns the input unchanged for blank/unrecognised formats.
     */
    private static String normalizeDate(String date) {
        if (date == null || date.isBlank()) return date;
        String[] p = date.split("-");
        if (p.length != 3) return date;
        // YYYY-MM-DD -> MM-DD-YYYY
        if (p[0].length() == 4) return p[1] + "-" + p[2] + "-" + p[0];
        // Already MM-DD-YYYY
        return date;
    }
}
