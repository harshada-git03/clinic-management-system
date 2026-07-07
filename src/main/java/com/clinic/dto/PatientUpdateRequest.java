package com.clinic.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PatientUpdateRequest {
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String allergies;
    private String medicalHistory;
    private String address;
    private String emergencyContact;
}
