package com.clinic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MedicineResponse {
    private Long id;
    private String name;
    private String manufacturer;
    private Double unitPrice;
    private Integer stockQuantity;
}