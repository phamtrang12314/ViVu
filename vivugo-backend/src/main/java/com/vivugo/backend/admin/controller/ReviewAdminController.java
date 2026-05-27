package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.request.ReviewStatusRequest;
import com.vivugo.backend.admin.dto.response.review.ReviewAdminResponse;
import com.vivugo.backend.admin.service.ReviewAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class ReviewAdminController {

    private final ReviewAdminService reviewAdminService;

    // GET danh sách review
    @GetMapping
    public ResponseEntity<Page<ReviewAdminResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(reviewAdminService.getAllReviews(page, size, status));
    }

    // PATCH cập nhật status (APPROVED hoặc HIDDEN)
    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable String id,
            @RequestBody ReviewStatusRequest request) {

        reviewAdminService.updateStatus(id, request);
        return ResponseEntity.ok("Cập nhật trạng thái review thành công");
    }
}
