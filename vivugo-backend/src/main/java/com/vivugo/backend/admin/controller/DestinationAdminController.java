package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.request.DestinationRequest;
import com.vivugo.backend.admin.dto.response.destination.DestinationAdminResponse;
import com.vivugo.backend.admin.dto.response.destination.DestinationDetailAdminResponse;
import com.vivugo.backend.admin.service.DestinationAdminService;
import com.vivugo.backend.model.Destination;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/destinations")
public class DestinationAdminController {

    private final DestinationAdminService destinationAdminService;

    public DestinationAdminController(DestinationAdminService destinationAdminService) {
        this.destinationAdminService = destinationAdminService;
    }

    // Dùng cho màn Manage Destination (phân trang + search + filter)
    @GetMapping
    public ResponseEntity<Page<DestinationAdminResponse>> searchDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String location
    ) {
        Page<DestinationAdminResponse> result =
                destinationAdminService.getAllDestinations(page, size, search, region, location);
        return ResponseEntity.ok(result);
    }

    // chi tiết điểm đến
    @GetMapping("/{id}")
    public ResponseEntity<DestinationDetailAdminResponse> getDestinationDetail(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(destinationAdminService.getDestinationDetail(id));
    }

    @PostMapping
    public ResponseEntity<DestinationAdminResponse> create(
            @RequestBody DestinationRequest request
    ) {
        Destination created = destinationAdminService.createDestination(request);
        return ResponseEntity.ok(new DestinationAdminResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DestinationAdminResponse> update(
            @PathVariable String id,
            @RequestBody DestinationRequest request
    ) {
        Destination updated = destinationAdminService.updateDestination(id, request);
        return ResponseEntity.ok(new DestinationAdminResponse(updated));
    }

    // Dùng cho màn quản lý tour (fill combobox điểm đến)
    @GetMapping("/tour")
    public ResponseEntity<List<DestinationAdminResponse>> getDestinationsForTour(
            @RequestParam(required = false) String region
    ) {
        if (region != null && !region.isBlank()) {
            return ResponseEntity.ok(destinationAdminService.getByRegion(region));
        }
        return ResponseEntity.ok(destinationAdminService.getAll());
    }

}
