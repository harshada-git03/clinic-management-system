package com.clinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicineRequest {

    @NotBlank
    private String name;

    private String manufacturer;

    @NotNull
    private Double unitPrice;

    private Integer stockQuantity;
}