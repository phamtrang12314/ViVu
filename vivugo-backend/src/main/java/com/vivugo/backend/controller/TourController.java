package com.vivugo.backend.controller;

import com.vivugo.backend.dto.TourDetailsResponse;
import com.vivugo.backend.dto.TourSummaryResponse;
import com.vivugo.backend.dto.TourViewRequest;
import com.vivugo.backend.service.RecommendationService;
import com.vivugo.backend.service.TourService;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    private final TourService tourService;
    private final RecommendationService recommendationService;

    public TourController(TourService tourService, RecommendationService recommendationService) {
        this.tourService = tourService;
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<Page<TourSummaryResponse>> getAllTours(
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
        return ResponseEntity.ok(tourService.getTourDetails(id));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> recordTourView(
            @PathVariable String id,
            @RequestBody(required = false) TourViewRequest request,
            Authentication authentication
    ) {
        recommendationService.recordTourView(
                id,
                request == null ? null : request.getSessionId(),
                authentication
        );
        return ResponseEntity.noContent().build();
    }
}
