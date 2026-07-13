package com.clinic.service;

import com.clinic.dto.AppointmentRequest;
import com.clinic.dto.AppointmentResponse;
import com.clinic.dto.AppointmentStatusUpdateRequest;
import com.clinic.entity.Appointment;
import com.clinic.entity.Doctor;
import com.clinic.entity.Patient;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentResponse bookAppointment(String patientEmail, AppointmentRequest request) {
        Patient patient = resolvePatientByEmail(patientEmail);

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .scheduledAt(request.getScheduledAt())
                .reason(request.getReason())
                .status(Appointment.AppointmentStatus.PENDING)
                .build();

        return toResponse(appointmentRepository.save(appointment));
    }


    public List<AppointmentResponse> getMyAppointments(String email, String role) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();

        List<Appointment> appointments;
        if ("PATIENT".equals(role)) {
            Patient patient = patientRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
            appointments = appointmentRepository.findByPatientIdOrderByScheduledAtDesc(patient.getId());
        } else if ("DOCTOR".equals(role)) {
            Doctor doctor = doctorRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
            appointments = appointmentRepository.findByDoctorIdOrderByScheduledAtDesc(doctor.getId());
        } else {
            throw new IllegalArgumentException("This endpoint is only for patients and doctors");
        }

        return appointments.stream().map(this::toResponse).toList();
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse updateStatus(Long id, AppointmentStatusUpdateRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        appointment.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            appointment.setNotes(request.getNotes());
        }

        return toResponse(appointmentRepository.save(appointment));
    }

    private Patient resolvePatientByEmail(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
    }

    private AppointmentResponse toResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getUser().getFullName())
                .doctorId(a.getDoctor().getId())
                .doctorName(a.getDoctor().getUser().getFullName())
                .scheduledAt(a.getScheduledAt())
                .status(a.getStatus())
                .reason(a.getReason())
                .notes(a.getNotes())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
