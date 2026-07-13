package com.clinic.repository;

import com.clinic.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByScheduledAtDesc(Long patientId);
    List<Appointment> findByDoctorIdOrderByScheduledAtDesc(Long doctorId);
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
}
