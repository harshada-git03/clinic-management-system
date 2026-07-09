package com.clinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrescriptionItemRequest {

    @NotNull
    private Long medicineId;

    @NotBlank
    private String dosage;

    @NotBlank
    private String frequency;

    private Integer durationDays;

    private String instructions;
}
