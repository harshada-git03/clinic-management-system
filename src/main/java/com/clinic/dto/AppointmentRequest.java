package com.clinic.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentRequest {

    @NotNull
    private Long doctorId;

    @NotNull
    @Future
    private LocalDateTime scheduledAt;

    private String reason;
}


