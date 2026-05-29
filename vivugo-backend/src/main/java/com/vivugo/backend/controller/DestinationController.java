package com.vivugo.backend.controller;

import com.vivugo.backend.dto.DestinationResponse;
import com.vivugo.backend.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ResponseEntity<List<DestinationResponse>> getAllDestinations(
            // (1) Đổi tên param thành 'region' cho nhất quán
            @RequestParam(name = "region", required = false) String region
    ) {
        List<DestinationResponse> destinations;

        // (2) SỬA LỖI LOGIC TẠI ĐÂY:
        // Phải kiểm tra xem 'region' có được cung cấp hay không
        if (region != null && !region.isEmpty()) {
            // Nếu có, gọi service để lọc theo region
            destinations = destinationService.getAllDestinations(region);
        } else {
            // Nếu không, gọi service để lấy TẤT CẢ
            destinations = destinationService.getAllDestinations(); // <-- Gọi phương thức không tham số
        }

        return ResponseEntity.ok(destinations);
    }
}