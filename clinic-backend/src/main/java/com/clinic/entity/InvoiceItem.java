package com.clinic.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invoice_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    // e.g. "Consultation Fee", "Paracetamol 500mg x10"
    @Column(nullable = false)
    private String description;

    @Builder.Default
    private Integer quantity = 1;

    @Column(nullable = false)
    private Double unitPrice;

    @Column(nullable = false)
    private Double amount; // quantity * unitPrice, set in service layer
}
