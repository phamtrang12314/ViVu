package com.vivugo.backend.controller;

import com.vivugo.backend.dto.TourDetailsResponse;
import com.vivugo.backend.dto.TourSummaryResponse;
import com.vivugo.backend.service.TourService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours") // API này đã được permitAll() trong SecurityConfig
// @CrossOrigin(origins = "*")
public class TourController {

    private final TourService tourService;

    // (1) Dùng constructor để Spring tiêm (inject)
    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public ResponseEntity<Page<TourSummaryResponse>> getAllTours(
            // (2) Lấy các tham số từ Query Params
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String search,
            @RequestParam(name = "destination_id", required = false) String destinationId,
            @RequestParam(name = "tour_type_id", required = false) String tourTypeId,
            @RequestParam(name = "price_min", required = false) Double priceMin,
            @RequestParam(name = "price_max", required = false) Double priceMax,
            @RequestParam(name = "region", required = false) String region,
            @RequestParam(name = "deals_only", required = false) Boolean dealsOnly,
            @RequestParam(name = "duration_min", required = false) Integer durationMin,
            @RequestParam(name = "duration_max", required = false) Integer durationMax
    ) {
        Page<TourSummaryResponse> tourPage = tourService.getAllActiveTours(
                page, size, sort, search, destinationId, tourTypeId, priceMin, priceMax, region,
                dealsOnly, durationMin, durationMax
        );
        return ResponseEntity.ok(tourPage);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<TourSummaryResponse>> getTrendingTours(
            @RequestParam(defaultValue = "8") int size) {
        return ResponseEntity.ok(tourService.getTrendingTours(size));
    }

    @GetMapping("/deals")
    public ResponseEntity<List<TourSummaryResponse>> getDealTours(
            @RequestParam(defaultValue = "8") int size) {
        return ResponseEntity.ok(tourService.getDealTours(size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDetailsResponse> getTourById(@PathVariable String id) {
        // Lấy ID từ đường dẫn (ví dụ: /api/tours/uuid-cua-tour)
        TourDetailsResponse tourDetails = tourService.getTourDetails(id);
        // Service sẽ ném ResourceNotFoundException nếu không tìm thấy,
        // tự động trả về lỗi 404 cho client.
        return ResponseEntity.ok(tourDetails);
    }

    // TODO: Thêm API GET /api/tours/{id} (Lấy chi tiết 1 tour) ở đây
}