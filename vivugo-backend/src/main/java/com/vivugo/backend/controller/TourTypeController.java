package com.vivugo.backend.controller;

import com.vivugo.backend.dto.TourTypeDto;
import com.vivugo.backend.service.TourTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tour-types") // API này đã được permitAll() trong SecurityConfig
public class TourTypeController {

    private final TourTypeService tourTypeService;

    // (1) Dùng constructor để Spring tiêm (inject)
    public TourTypeController(TourTypeService tourTypeService) {
        this.tourTypeService = tourTypeService;
    }

    @GetMapping
    public ResponseEntity<List<TourTypeDto>> getAllTourTypes() {
        // (2) Gọi service để lấy danh sách DTO
        List<TourTypeDto> tourTypes = tourTypeService.getAllTourTypes();

        // (3) Trả về danh sách với status 200 OK
        return ResponseEntity.ok(tourTypes);
    }
}