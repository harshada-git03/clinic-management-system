package com.clinic.controller;

import com.clinic.dto.PrescriptionRequest;
import com.clinic.dto.PrescriptionResponse;
import com.clinic.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    // Doctor logs a prescription record after a visit
    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionResponse> createPrescription(
            Authentication authentication,
            @Valid @RequestBody PrescriptionRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(prescriptionService.createPrescription(email, request));
    }

    // Patient views their own prescription history
    @GetMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<PrescriptionResponse>> getMyPrescriptions(Authentication authentication) {
        return ResponseEntity.ok(prescriptionService.getMyPrescriptions(authentication.getName()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<PrescriptionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.getById(id));
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<PrescriptionResponse> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(prescriptionService.getByAppointmentId(appointmentId));
    }
}

