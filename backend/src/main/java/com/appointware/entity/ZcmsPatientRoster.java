package com.appointware.entity;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "zcms_patient_rosters")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ZcmsPatientRoster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /** Hospital NAME (legacy column). E.g. "Aliana Animal Hospital". */
    @Column(length = 250)
    private String hospital;

    @Column(length = 250)
    private String phone;

    @Column(name = "first_name", length = 250)
    @JsonAlias({"first_name"})
    private String firstName;

    @Column(name = "last_name", length = 250)
    @JsonAlias({"last_name"})
    private String lastName;

    @Column(length = 250)
    private String email;

    @Column(columnDefinition = "TEXT")
    @JsonAlias({"address_1"})
    private String address1;

    @Column(columnDefinition = "TEXT")
    @JsonAlias({"address_2"})
    private String address2;

    @Column(length = 250)
    private String city;

    @Column(length = 250)
    private String state;

    @Column(length = 250)
    private String zip;

    @Column(name = "attender_name", length = 250)
    @JsonAlias({"attender_name"})
    private String attenderName;

    @Column(name = "attender_phone", length = 250)
    @JsonAlias({"attender_phone"})
    private String attenderPhone;

    /** Optional - patient type label (e.g. dog, cat). Added in the Spring rewrite. */
    @Column(name = "patient_type", length = 250)
    @JsonAlias({"patient_type"})
    private String patientType;

    /** Optional - free-form address. Kept for backwards compatibility with the
     *  Spring add-flow before address1/address2 existed. */
    @Column(columnDefinition = "TEXT")
    private String address;

    /** Numeric hospital id (Spring addition). Used by the /{hospitalId} endpoint. */
    @Column(name = "hospital_id", length = 250)
    @JsonAlias({"hospital_id"})
    private String hospitalId;

    @Column
    @Builder.Default
    private Integer status = 0;

    @Column(name = "is_deleted")
    @JsonAlias({"is_deleted"})
    @Builder.Default
    private Integer isDeleted = 0;
}
