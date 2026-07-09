package com.clinic.service;

import com.clinic.dto.PrescriptionRequest;
import com.clinic.dto.PrescriptionResponse;
import com.clinic.entity.*;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicineRepository medicineRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Transactional
    public PrescriptionResponse createPrescription(String doctorEmail, PrescriptionRequest request) {
        Doctor doctor = resolveDoctorByEmail(doctorEmail);

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appointment not found with id: " + request.getAppointmentId()));

        
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalArgumentException("You can only write prescriptions for your own appointments");
        }

        Prescription prescription = Prescription.builder()
                .appointment(appointment)
                .doctor(doctor)
                .patient(appointment.getPatient())
                .notes(request.getNotes())
                .build();

        request.getItems().forEach(itemReq -> {
            Medicine medicine = medicineRepository.findById(itemReq.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Medicine not found with id: " + itemReq.getMedicineId()));

            PrescriptionItem item = PrescriptionItem.builder()
                    .prescription(prescription)
                    .medicine(medicine)
                    .dosage(itemReq.getDosage())
                    .frequency(itemReq.getFrequency())
                    .durationDays(itemReq.getDurationDays())
                    .instructions(itemReq.getInstructions())
                    .build();

            prescription.getItems().add(item);
        });

        return toResponse(prescriptionRepository.save(prescription));
    }

    public PrescriptionResponse getById(Long id) {
        Prescription p = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        return toResponse(p);
    }

    public PrescriptionResponse getByAppointmentId(Long appointmentId) {
        Prescription p = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No prescription found for appointment id: " + appointmentId));
        return toResponse(p);
    }

    public List<PrescriptionResponse> getMyPrescriptions(String patientEmail) {
        Long userId = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        return prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId())
                .stream().map(this::toResponse).toList();
    }

    private Doctor resolveDoctorByEmail(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    private PrescriptionResponse toResponse(Prescription p) {
        List<PrescriptionResponse.ItemResponse> items = p.getItems().stream()
                .map(item -> PrescriptionResponse.ItemResponse.builder()
                        .medicineId(item.getMedicine().getId())
                        .medicineName(item.getMedicine().getName())
                        .dosage(item.getDosage())
                        .frequency(item.getFrequency())
                        .durationDays(item.getDurationDays())
                        .instructions(item.getInstructions())
                        .build())
                .toList();

        return PrescriptionResponse.builder()
                .id(p.getId())
                .appointmentId(p.getAppointment().getId())
                .doctorId(p.getDoctor().getId())
                .doctorName(p.getDoctor().getUser().getFullName())
                .patientId(p.getPatient().getId())
                .patientName(p.getPatient().getUser().getFullName())
                .notes(p.getNotes())
                .createdAt(p.getCreatedAt())
                .items(items)
                .build();
    }
}
