package com.clinic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class PatientResponse {
    private Long id;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String allergies;
    private String medicalHistory;
    private String address;
    private String emergencyContact;
}
