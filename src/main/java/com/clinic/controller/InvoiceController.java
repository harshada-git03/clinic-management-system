package com.clinic.controller;

import com.clinic.dto.InvoiceResponse;
import com.clinic.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    
    @PostMapping("/generate/{appointmentId}")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<InvoiceResponse> generateInvoice(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(invoiceService.generateInvoice(appointmentId));
    }

    
    @PutMapping("/{id}/pay")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<InvoiceResponse> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.markAsPaid(id));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'RECEPTIONIST')")
    public ResponseEntity<InvoiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    
    @GetMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<InvoiceResponse>> getMyInvoices(Authentication authentication) {
        return ResponseEntity.ok(invoiceService.getMyInvoices(authentication.getName()));
    }
}


