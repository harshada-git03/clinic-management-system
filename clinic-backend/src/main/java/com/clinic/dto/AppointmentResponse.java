package com.clinic.dto;

import com.clinic.entity.Appointment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private LocalDateTime scheduledAt;
    private Appointment.AppointmentStatus status;
    private String reason;
    private String notes;
    private LocalDateTime createdAt;
}
