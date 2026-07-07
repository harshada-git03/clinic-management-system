package com.clinic.dto;

import com.clinic.entity.Appointment;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentStatusUpdateRequest {

    @NotNull
    private Appointment.AppointmentStatus status;

    private String notes;
}
