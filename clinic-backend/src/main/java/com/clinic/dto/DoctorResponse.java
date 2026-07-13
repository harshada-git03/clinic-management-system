package com.clinic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DoctorResponse {
    private Long id;
    private String fullName;
    private String email;
    private String specialization;
    private String qualification;
    private Double consultationFee;
    private String availability;
}
