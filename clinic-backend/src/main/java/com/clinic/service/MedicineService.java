package com.clinic.service;

import com.clinic.dto.MedicineRequest;
import com.clinic.dto.MedicineResponse;
import com.clinic.entity.Medicine;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public List<MedicineResponse> getAllMedicines() {
        return medicineRepository.findAll().stream().map(this::toResponse).toList();
    }

    public MedicineResponse createMedicine(MedicineRequest request) {
        Medicine medicine = Medicine.builder()
                .name(request.getName())
                .manufacturer(request.getManufacturer())
                .unitPrice(request.getUnitPrice())
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                .build();
        return toResponse(medicineRepository.save(medicine));
    }

    private MedicineResponse toResponse(Medicine m) {
        return MedicineResponse.builder()
                .id(m.getId())
                .name(m.getName())
                .manufacturer(m.getManufacturer())
                .unitPrice(m.getUnitPrice())
                .stockQuantity(m.getStockQuantity())
                .build();
    }
}
