package com.clinic.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorUpdateRequest {
    private String specialization;
    private String qualification;
    private Double consultationFee;
    private String availability;
}
