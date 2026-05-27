package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.request.TourRequest;
import com.vivugo.backend.admin.dto.response.tour.TourAdminResponse;
import com.vivugo.backend.admin.dto.response.tour.TourDetailAdminResponse;
import com.vivugo.backend.admin.dto.response.tour.TourSimpleForParticipantsAdminResponse;
import com.vivugo.backend.admin.dto.response.tour.TourSimpleResponse;
import com.vivugo.backend.admin.service.TourAdminService;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.enums.TourStatus;
import com.vivugo.backend.repository.TourRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

@RestController
@RequestMapping("/api/admin/tours")
public class TourAdminController {

    private final TourAdminService tourAdminService;
    private final TourRepository tourRepository;

    public TourAdminController(TourAdminService tourAdminService, TourRepository tourRepository) {
        this.tourAdminService = tourAdminService;
        this.tourRepository = tourRepository;
    }

    @GetMapping
    public ResponseEntity<Page<TourAdminResponse>> getAllTours(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(name = "tour_type_id", required = false) String tourTypeId,
            @RequestParam(required = false) String status
    ) {
        Page<TourAdminResponse> tourPage = tourAdminService.getAllTours(page, size, search, tourTypeId, status);
        return ResponseEntity.ok(tourPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDetailAdminResponse> getById(@PathVariable String id) {
        TourDetailAdminResponse dto = tourAdminService.getTourDetail(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<Tour> create(@RequestBody TourRequest request) {
        Tour created = tourAdminService.createTour(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tour> update(@PathVariable String id,
                                       @RequestBody TourRequest request) {
        Tour updated = tourAdminService.updateTour(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/open-simple")
    public ResponseEntity<List<TourSimpleResponse>> getOpenToursSimple() {
        return ResponseEntity.ok(tourAdminService.getOpenToursSimple());
    }

    // lấy danh sách tour đã hoàn thành
    @GetMapping("/completed-simple")
    public ResponseEntity<List<TourSimpleResponse>> getCompletedToursSimple() {
        return ResponseEntity.ok(tourAdminService.getCompletedToursSimple());
    }


    @GetMapping("/participants-search")
    public ResponseEntity<List<TourSimpleForParticipantsAdminResponse>> searchToursForParticipants(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(
                tourAdminService.searchToursForParticipants(keyword)
        );
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable String id) {
        tourAdminService.completeTour(id);
        return ResponseEntity.noContent().build();
    }




}
