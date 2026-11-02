package com.appointware.controller;

import com.appointware.common.ApiResponse;
import com.appointware.dto.request.AppointmentCompleteRequest;
import com.appointware.dto.response.HospitalAppointmentsResponse;
import com.appointware.entity.AccountsAppointment;
import com.appointware.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/appointments")
@RequiredArgsConstructor
public class AdminAppointmentController {

    private final AppointmentService service;

    @GetMapping("/{id}")
    public ApiResponse<List<AccountsAppointment>> get(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.get(id)));
    }

    /** PHP: all_appointment */
    @GetMapping("/by-doctor/{doctorId}")
    public ApiResponse<List<AccountsAppointment>> byDoctor(@PathVariable Integer doctorId) {
        return ApiResponse.success(service.getByDoctor(doctorId));
    }

    /** PHP: get_custom_appointment_by_date */
    @GetMapping("/by-doctor/{doctorId}/date/{date}")
    public ApiResponse<List<AccountsAppointment>> byDoctorAndDate(@PathVariable Integer doctorId,
                                                                   @PathVariable String date) {
        return ApiResponse.success(service.getByDoctorAndDate(doctorId, date));
    }

    /** PHP: completd_all_appointment */
    @GetMapping("/by-doctor/{doctorId}/completed")
    public ApiResponse<List<AccountsAppointment>> completedByDoctor(@PathVariable Integer doctorId) {
        return ApiResponse.success(service.getCompletedByDoctor(doctorId));
    }

    /** PHP: custom_hospital_appoinments / custom_hospital_appoinments_mob */
    @GetMapping("/by-hospital/{hospitalId}")
    public ApiResponse<List<HospitalAppointmentsResponse>> byHospital(@PathVariable Integer hospitalId,
                                                                       @RequestParam(required = false) String date) {
        return ApiResponse.success(service.hospitalAppointments(hospitalId, date));
    }

    /** PHP: custom_appointment_update */
    @PostMapping("/{id}/complete")
    public ApiResponse<List<AccountsAppointment>> complete(@PathVariable Integer id,
                                                            @RequestBody AppointmentCompleteRequest req) {
        req.setAppointmentId(id);
        return ApiResponse.success(List.of(service.completeAndReschedule(req)));
    }

    /** PHP: custom_appointment_update_noshow */
    @PostMapping("/{id}/no-show")
    public ApiResponse<List<AccountsAppointment>> noShow(@PathVariable Integer id) {
        return ApiResponse.success(List.of(service.markNoShow(id)));
    }

    /** PHP: is_show */
    @PatchMapping("/{id}/show")
    public ApiResponse<List<AccountsAppointment>> toggleShow(@PathVariable Integer id,
                                                              @RequestParam Integer isShow) {
        return ApiResponse.success(List.of(service.toggleShow(id, isShow)));
    }

    /** PHP: delete&table=accounts_appointment — hard-delete an appointment. */
    @DeleteMapping("/{id}")
    public ApiResponse<List<ApiResponse.Message>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ApiResponse.message(1, 200, "Appointment deleted");
    }

    // ------------------------------------------------------------------
    // Today advance-SMS broadcasts
    // ------------------------------------------------------------------

    /**
     * PHP: today_doctor_patient_sms
     * Send today's advance reminder SMS for one doctor's incomplete patients.
     * Example: POST /api/admin/appointments/today-advance-sms/by-doctor/205
     */
    @PostMapping("/today-advance-sms/by-doctor/{doctorId}")
    public ApiResponse<List<java.util.Map<String, Object>>> todayAdvanceSmsForDoctor(@PathVariable Integer doctorId) {
        int sent = service.sendTodayAdvanceSmsForDoctor(doctorId);
        return ApiResponse.success(List.of(java.util.Map.of(
                "msg", "Sent message successfully",
                "sent", sent
        )));
    }

    /**
     * PHP: today_sms (today_twilio_sms)
     * Send today's advance reminder SMS for EVERY appointment today (no template,
     * no completion filter). Uses a hardcoded message body.
     */
    @PostMapping("/today-advance-sms")
    public ApiResponse<List<java.util.Map<String, Object>>> todayAdvanceSmsAll() {
        int sent = service.sendTodayAdvanceSmsAll();
        return ApiResponse.success(List.of(java.util.Map.of(
                "msg", "Sent message successfully",
                "sent", sent
        )));
    }

    /**
     * PHP: cron_today_doctor_patient_sms
     * Loops over every active doctor and sends today's advance SMS to patients
     * whose slot has not yet passed in the doctor's timezone. The same logic
     * also runs automatically at 08:00 server time daily via @Scheduled.
     */
    @PostMapping("/today-advance-sms/cron-run")
    public ApiResponse<List<java.util.Map<String, Object>>> todayAdvanceSmsCronRun() {
        int sent = service.sendTodayAdvanceSmsForAllDoctors();
        return ApiResponse.success(List.of(java.util.Map.of(
                "msg", "Sent message successfully",
                "sent", sent
        )));
    }
}
