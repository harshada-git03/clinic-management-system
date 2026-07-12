package com.clinic.service;

import com.clinic.dto.InvoiceResponse;
import com.clinic.entity.*;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Transactional
    public InvoiceResponse generateInvoice(Long appointmentId) {
        if (invoiceRepository.findByAppointmentId(appointmentId).isPresent()) {
            throw new IllegalArgumentException("An invoice already exists for this appointment");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appointment not found with id: " + appointmentId));

        List<InvoiceItem> items = new ArrayList<>();

        
        Double consultationFee = appointment.getDoctor().getConsultationFee();
        if (consultationFee == null) {
            consultationFee = 0.0;
        }
        InvoiceItem consultationItem = InvoiceItem.builder()
                .description("Consultation Fee -  " + appointment.getDoctor().getUser().getFullName())
                .quantity(1)
                .unitPrice(consultationFee)
                .amount(consultationFee)
                .build();
        items.add(consultationItem);

        
        prescriptionRepository.findByAppointmentId(appointmentId).ifPresent(prescription -> {
            prescription.getItems().forEach(pItem -> {
                Medicine medicine = pItem.getMedicine();
                int qty = pItem.getDurationDays() != null ? pItem.getDurationDays() : 1;
                double amount = medicine.getUnitPrice() * qty;

                items.add(InvoiceItem.builder()
                        .description(medicine.getName())
                        .quantity(qty)
                        .unitPrice(medicine.getUnitPrice())
                        .amount(amount)
                        .build());
            });
        });

        double total = items.stream().mapToDouble(InvoiceItem::getAmount).sum();

        Invoice invoice = Invoice.builder()
                .appointment(appointment)
                .patient(appointment.getPatient())
                .totalAmount(total)
                .status(Invoice.InvoiceStatus.PENDING)
                .build();

        items.forEach(item -> {
            item.setInvoice(invoice);
            invoice.getItems().add(item);
        });

        return toResponse(invoiceRepository.save(invoice));
    }

    @Transactional
    public InvoiceResponse markAsPaid(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        invoice.setPaidAt(java.time.LocalDateTime.now());
        return toResponse(invoiceRepository.save(invoice));
    }

    public InvoiceResponse getById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
        return toResponse(invoice);
    }

    public List<InvoiceResponse> getMyInvoices(String patientEmail) {
        Long userId = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        return invoiceRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId())
                .stream().map(this::toResponse).toList();
    }

    private InvoiceResponse toResponse(Invoice invoice) {
        List<InvoiceResponse.ItemResponse> items = invoice.getItems().stream()
                .map(i -> InvoiceResponse.ItemResponse.builder()
                        .description(i.getDescription())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .amount(i.getAmount())
                        .build())
                .toList();

        return InvoiceResponse.builder()
                .id(invoice.getId())
                .appointmentId(invoice.getAppointment().getId())
                .patientId(invoice.getPatient().getId())
                .patientName(invoice.getPatient().getUser().getFullName())
                .totalAmount(invoice.getTotalAmount())
                .status(invoice.getStatus())
                .createdAt(invoice.getCreatedAt())
                .paidAt(invoice.getPaidAt())
                .items(items)
                .build();
    }
}
