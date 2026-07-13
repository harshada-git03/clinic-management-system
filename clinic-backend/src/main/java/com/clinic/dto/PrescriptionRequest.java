package com.clinic.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PrescriptionRequest {

    @NotNull
    private Long appointmentId;

    private String notes;

    @NotEmpty
    @Valid
    private List<PrescriptionItemRequest> items;
}
