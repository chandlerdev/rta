package com.appointware.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class MultipleAppointmentRequest {
    private Integer doctorId;
    private List<Slot> slots;

    @Data
    public static class Slot {
        private String firstName;
        private String lastName;
        private String phone;
        private String email;
        private String age;
        private String gender;
        private String purpose;
        private String date;
        private String fromTime;
        private String todTime;
    }
}
