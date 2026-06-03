package com.vivugo.backend.service;

import com.vivugo.backend.dto.TourTypeDto; // (1) Dùng lại DTO đã tạo
import com.vivugo.backend.model.TourType;
import com.vivugo.backend.repository.TourTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourTypeService {

    private final TourTypeRepository tourTypeRepository;

    // (2) Dùng constructor để Spring tiêm (inject)
    public TourTypeService(TourTypeRepository tourTypeRepository) {
        this.tourTypeRepository = tourTypeRepository;
    }

    // (3) Phương thức lấy tất cả và chuyển đổi
    public List<TourTypeDto> getAllTourTypes() {
        // Lấy tất cả Entity từ CSDL
        List<TourType> tourTypes = tourTypeRepository.findAll();

        // Chuyển đổi List<TourType> sang List<TourTypeDto>
        return tourTypes.stream()
                .map(TourTypeDto::new) // Dùng constructor của TourTypeDto
                .collect(Collectors.toList());
    }
}