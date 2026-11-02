package com.appointware.repository;

import com.appointware.entity.AccountsAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AccountsAppointmentRepository extends JpaRepository<AccountsAppointment, Integer> {

    List<AccountsAppointment> findByDocIdIdAndDate(Integer docIdId, String date);
    List<AccountsAppointment> findByDocIdIdAndCusDate(Integer docIdId, String cusDate);
    List<AccountsAppointment> findByDocIdIdAndDateAndFromTime(Integer docIdId, String date, String fromTime);
    List<AccountsAppointment> findByPatientIdId(Integer patientIdId);
    List<AccountsAppointment> findByDocIdId(Integer docIdId);
    List<AccountsAppointment> findByDocIdIdAndIsCompleted(Integer docIdId, Integer isCompleted);

    /**
     * Used by today_doctor_patient_sms / cron_today_doctor_patient_sms.
     * Treats NULL is_completed / is_show as 0 so legacy imported rows
     * (where Lombok's @Builder skipped the field defaults) still match.
     */
    @Query("SELECT a FROM AccountsAppointment a WHERE a.docIdId = :docId AND a.date = :date "
            + "AND (a.isCompleted = 0 OR a.isCompleted IS NULL) "
            + "AND (a.isShow = 0 OR a.isShow IS NULL)")
    List<AccountsAppointment> findTodayCandidatesForDoctor(@Param("docId") Integer docId,
                                                            @Param("date") String date);

    /** Used by today_sms (today_twilio_sms) - every appointment for the day. */
    List<AccountsAppointment> findByDate(String date);

    @Query("SELECT a FROM AccountsAppointment a WHERE a.docIdId = :docId AND a.date = :date "
            + "AND a.fromTime > :fromTime "
            + "AND (a.isShow = 0 OR a.isShow IS NULL) "
            + "AND (a.isCompleted = 0 OR a.isCompleted IS NULL) "
            + "ORDER BY a.fromTime ASC")
    List<AccountsAppointment> findFollowingSlots(@Param("docId") Integer docId,
                                                 @Param("date") String date,
                                                 @Param("fromTime") String fromTime);

    @Query("SELECT a FROM AccountsAppointment a WHERE a.docIdId = :docId AND a.date = :date "
            + "AND a.fromTime < :fromTime AND a.todTime > :fromTime")
    List<AccountsAppointment> findOverlapping(@Param("docId") Integer docId,
                                              @Param("date") String date,
                                              @Param("fromTime") String fromTime);

    // ------------------------------------------------------------------
    // Lunch-break aware reschedule (PHP custom_appointment_update1 else-branch)
    // ------------------------------------------------------------------

    /** PHP: "Check with last id before lunch" - prefer an already-rescheduled
     *  slot whose reschdule_time is before the break start. */
    @Query("SELECT a FROM AccountsAppointment a WHERE a.docIdId = :docId AND a.date = :date "
            + "AND (a.isShow = 0 OR a.isShow IS NULL) "
            + "AND (a.isCompleted = 0 OR a.isCompleted IS NULL) "
            + "AND a.reschduleTime <> '' AND a.reschduleTime < :breakStart "
            + "ORDER BY a.fromTime DESC")
    List<AccountsAppointment> findLastRescheduledBeforeBreak(@Param("docId") Integer docId,
                                                             @Param("date") String date,
                                                             @Param("breakStart") String breakStart);

    /** PHP fallback: last slot whose from_time is before the break start. */
    @Query("SELECT a FROM AccountsAppointment a WHERE a.docIdId = :docId AND a.date = :date "
            + "AND (a.isShow = 0 OR a.isShow IS NULL) "
            + "AND (a.isCompleted = 0 OR a.isCompleted IS NULL) "
            + "AND a.fromTime < :breakStart "
            + "ORDER BY a.fromTime DESC")
    List<AccountsAppointment> findLastBeforeBreak(@Param("docId") Integer docId,
                                                  @Param("date") String date,
                                                  @Param("breakStart") String breakStart);

    /** Following slots, bounded to those starting before the lunch break. */
    @Query("SELECT a FROM AccountsAppointment a WHERE a.docIdId = :docId AND a.date = :date "
            + "AND a.fromTime > :fromTime AND a.fromTime < :breakStart "
            + "AND (a.isShow = 0 OR a.isShow IS NULL) "
            + "AND (a.isCompleted = 0 OR a.isCompleted IS NULL) "
            + "ORDER BY a.fromTime ASC")
    List<AccountsAppointment> findFollowingSlotsBeforeBreak(@Param("docId") Integer docId,
                                                            @Param("date") String date,
                                                            @Param("fromTime") String fromTime,
                                                            @Param("breakStart") String breakStart);

    /** Slots from the given from_time up to (but not into) the lunch break. */
    @Query("SELECT a FROM AccountsAppointment a WHERE a.docIdId = :docId AND a.date = :date "
            + "AND a.fromTime >= :fromTime AND a.fromTime < :breakStart "
            + "AND (a.isShow = 0 OR a.isShow IS NULL) "
            + "AND (a.isCompleted = 0 OR a.isCompleted IS NULL) "
            + "ORDER BY a.fromTime ASC")
    List<AccountsAppointment> findSlotsUntilBreak(@Param("docId") Integer docId,
                                                  @Param("date") String date,
                                                  @Param("fromTime") String fromTime,
                                                  @Param("breakStart") String breakStart);

    /** Slots that start at/after the lunch break end. */
    @Query("SELECT a FROM AccountsAppointment a WHERE a.docIdId = :docId AND a.date = :date "
            + "AND a.fromTime >= :breakStart "
            + "AND (a.isShow = 0 OR a.isShow IS NULL) "
            + "AND (a.isCompleted = 0 OR a.isCompleted IS NULL) "
            + "ORDER BY a.fromTime ASC")
    List<AccountsAppointment> findSlotsAfterBreak(@Param("docId") Integer docId,
                                                  @Param("date") String date,
                                                  @Param("breakStart") String breakStart);

    /** PHP: detects whether the lunch slot has already been placed
     *  (some appointment already ends exactly at the break end). */
    @Query("SELECT a FROM AccountsAppointment a WHERE a.docIdId = :docId AND a.date = :date "
            + "AND a.toTime = :breakEnd "
            + "AND (a.isShow = 0 OR a.isShow IS NULL) "
            + "AND (a.isCompleted = 0 OR a.isCompleted IS NULL)")
    List<AccountsAppointment> findEndingAtBreakEnd(@Param("docId") Integer docId,
                                                   @Param("date") String date,
                                                   @Param("breakEnd") String breakEnd);
}
