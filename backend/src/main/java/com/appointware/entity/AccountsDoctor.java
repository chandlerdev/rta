package com.appointware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * @DynamicUpdate generates UPDATE statements with only the columns whose
 * values changed since load, instead of every column. Critical here because
 * legacy rows have joined_date = '0000-00-00' (read as NULL via
 * zeroDateTimeBehavior=CONVERT_TO_NULL); without @DynamicUpdate a save() of
 * unrelated columns would still try to set joined_date = NULL and hit the
 * NOT NULL constraint inherited from the original PHP schema.
 */
@DynamicUpdate
@Entity
@Table(name = "accounts_doctor")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountsDoctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(length = 50)
    private String phone;

    @Column(length = 1)
    private String gender;

    @Column(length = 100)
    private String img;

    @Column(length = 100)
    private String specility;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 50)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(length = 10)
    private String zipcode;

    @Column(name = "time_zone", length = 250)
    private String timeZone;

    @Column(name = "from_time")
    private LocalTime fromTime;

    @Column(name = "to_time")
    private LocalTime toTime;

    @Column(name = "consult_time", length = 250)
    private String consultTime;

    @Column(columnDefinition = "longtext")
    private String intervel;

    @Column(name = "sms_intervel", columnDefinition = "longtext")
    private String smsIntervel;

    @Column(name = "sms_count", length = 250)
    private String smsCount;

    @Column(name = "from_time_break")
    private LocalTime fromTimeBreak;

    @Column(name = "to_time_break")
    private LocalTime toTimeBreak;

    /**
     * Doctor's daily check-in / check-out time. Added for future enhancement
     * (attendance / availability tracking). Nullable so pre-existing rows that
     * predate these columns remain valid; new records set them from the form.
     */
    @Column(name = "check_in_time")
    private LocalTime checkInTime;

    @Column(name = "check_out_time")
    private LocalTime checkOutTime;

    @Column(columnDefinition = "longtext")
    private String experience;

    @Column(length = 50)
    private String licence;

    @Column(name = "joined_date")
    private LocalDate joinedDate;

    @Column(name = "hospital_id_id")
    private Integer hospitalIdId;

    @Column(name = "hospital_id_id_copy")
    private Integer hospitalIdIdCopy;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "is_active")
    private Integer isActive = 0;

    @Column(name = "is_lunch")
    private Integer isLunch = 0;

    @Column(name = "time_type", length = 250)
    private String timeType;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;

    @Column(name = "google_link", length = 500)
    private String googleLink;

    @Column(name = "facebook_link", length = 500)
    private String facebookLink;

    /**
     * Not persisted - joined from accounts_user on read so list/get responses
     * include the credentials' email and username alongside the doctor's
     * own columns.
     */
    @Transient
    private String email;

    @Transient
    private String userName;
}
