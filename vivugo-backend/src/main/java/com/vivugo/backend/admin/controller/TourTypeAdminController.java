package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.request.TourTypeRequest;
import com.vivugo.backend.admin.dto.response.tourType.TourTypeAdminResponse;
import com.vivugo.backend.admin.dto.response.tourType.TourTypeResponse;      // dùng cho combobox
import com.vivugo.backend.admin.dto.response.tourType.TourTypeDetailAdminResponse;
import com.vivugo.backend.admin.service.TourTypeAdminService;
import com.vivugo.backend.model.TourType;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tour-types")
public class TourTypeAdminController {

    private final TourTypeAdminService tourTypeAdminService;

    public TourTypeAdminController(TourTypeAdminService tourTypeAdminService) {
        this.tourTypeAdminService = tourTypeAdminService;
    }

    @GetMapping("/select")
    public ResponseEntity<List<TourTypeResponse>> getAllTourTypesForTour() {
        return ResponseEntity.ok(tourTypeAdminService.getAllForTour());
    }


    @GetMapping
    public ResponseEntity<Page<TourTypeAdminResponse>> searchTourTypes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        Page<TourTypeAdminResponse> result =
                tourTypeAdminService.getAllTourTypes(page, size, search);
        return ResponseEntity.ok(result);
    }


    @GetMapping("/all")
    public ResponseEntity<List< TourTypeAdminResponse >> getAll() {
        return ResponseEntity.ok(tourTypeAdminService.getAll());
    }

    // Chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<TourTypeDetailAdminResponse> getDetail(@PathVariable String id) {
        return ResponseEntity.ok(tourTypeAdminService.getDetail(id));
    }

    // Tạo mới
    @PostMapping
    public ResponseEntity<TourTypeAdminResponse> create(@RequestBody TourTypeRequest req) {
        TourType created = tourTypeAdminService.create(req);
        return ResponseEntity.ok(new TourTypeAdminResponse(created));
    }

    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<TourTypeAdminResponse> update(
            @PathVariable String id,
            @RequestBody TourTypeRequest req
    ) {
        TourType updated = tourTypeAdminService.update(id, req);
        return ResponseEntity.ok(new TourTypeAdminResponse(updated));
    }

    // Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        tourTypeAdminService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
