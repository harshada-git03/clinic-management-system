package com.clinic.dto;

import com.clinic.entity.Invoice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class InvoiceResponse {
    private Long id;
    private Long appointmentId;
    private Long patientId;
    private String patientName;
    private Double totalAmount;
    private Invoice.InvoiceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private List<ItemResponse> items;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class ItemResponse {
        private String description;
        private Integer quantity;
        private Double unitPrice;
        private Double amount;
    }
}

