package com.clinic.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescription_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    // e.g. "500mg"
    @Column(nullable = false)
    private String dosage;

    // e.g. "Twice daily after food"
    @Column(nullable = false)
    private String frequency;

    private Integer durationDays;

    @Column(length = 500)
    private String instructions;
}
