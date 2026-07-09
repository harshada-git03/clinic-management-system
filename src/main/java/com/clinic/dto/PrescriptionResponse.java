package com.clinic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class PrescriptionResponse {
    private Long id;
    private Long appointmentId;
    private Long doctorId;
    private String doctorName;
    private Long patientId;
    private String patientName;
    private String notes;
    private LocalDateTime createdAt;
    private List<ItemResponse> items;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class ItemResponse {
        private Long medicineId;
        private String medicineName;
        private String dosage;
        private String frequency;
        private Integer durationDays;
        private String instructions;
    }
}
