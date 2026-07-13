package com.clinic.service;

import com.clinic.dto.PatientResponse;
import com.clinic.dto.PatientUpdateRequest;
import com.clinic.entity.Patient;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientResponse getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return toResponse(patient);
    }

    // Used for the "/me" endpoints — resolves the logged-in user's own patient record
    public PatientResponse getPatientByEmail(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        return toResponse(patient);
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PatientResponse updatePatient(Long id, PatientUpdateRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setAllergies(request.getAllergies());
        patient.setMedicalHistory(request.getMedicalHistory());
        patient.setAddress(request.getAddress());
        patient.setEmergencyContact(request.getEmergencyContact());

        Patient saved = patientRepository.save(patient);
        return toResponse(saved);
    }

    @Transactional
    public PatientResponse updateOwnProfile(String email, PatientUpdateRequest request) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        return updatePatient(patient.getId(), request);
    }

    private PatientResponse toResponse(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .fullName(patient.getUser().getFullName())
                .email(patient.getUser().getEmail())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .allergies(patient.getAllergies())
                .medicalHistory(patient.getMedicalHistory())
                .address(patient.getAddress())
                .emergencyContact(patient.getEmergencyContact())
                .build();
    }
}
